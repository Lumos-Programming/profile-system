package handler

import (
	"log/slog"
	"net/http"

	api "github.com/Lumos-Programming/profile-system-backend/api"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// 機能：Firestore の "members" コレクションから全ドキュメントを読み込み、api.MemberSummary の配列として返す。
func (h *Handler) GetApiMembers(c *gin.Context) {
	// --- ① Firestore へ問い合わせるための Context と iterator を用意 ---
	ctx := c.Request.Context()
	iter := h.fs.Collection("members").Documents(ctx)
	defer iter.Stop()

	// --- ② レスポンス用の配列を用意 ---
	out := make([]api.MemberSummary, 0)

	// --- ③ Firestore の全ドキュメントを順に読むループ ---
	for {
		doc, err := iter.Next()

		// --- ③-1 終了条件：最後まで読み終えた ---
		if err == iterator.Done {
			break
		}

		// --- ③-2 例外：Firestore から取れない（通信/権限/一時障害など） ---
		// このケースは API 全体として失敗扱い（500）にして返す
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// --- ④ ドキュメントを struct(api.MemberDetail) にデコード（型変換） ---
		// Firestoreのデータ型が struct と一致していれば成功する
		// 例）roles が []string で入っている、name が string で入っている、など
		var d api.MemberDetail
		if err := doc.DataTo(&d); err == nil {
			// --- ④-1 デコード成功：普通に MemberSummary に整形して out に追加 ---
			// d.Id が空なら docID で補う
			if d.Id == "" {
				d.Id = doc.Ref.ID
			}
			out = append(out, api.MemberSummary{
				Id:       d.Id,
				Name:     d.Name,
				Nickname: d.Nickname,
				Roles:    d.Roles,
				Avatar:   d.Avatar,
			})
			continue
		}

		// --- ⑤ デコード失敗時の扱い（ここが今回の方針変更点） ---
		// AFTER（現在の方針）：
		//   ・データ型が壊れている/想定外なら "壊れたドキュメント" とみなす
		//   ・Warnログを残して、その1件は一覧から除外（skip）する
		//   ・一覧API自体は落とさない（残りの正常データは返す）
		//
		// BEFORE（元の方針）は下のコメントアウト参照：
		//   ・doc.Data() の map を直接読んで
		//   ・asString / asStringSlice で無理やり値を拾って一覧に混ぜて返していた
		//   ・ただし不整合が「空文字/空配列」になって気づきにくい副作用があった

		// BEFORE (元コードの fallback：参考として残す)
		// slog.Warn("failed to parse document into MemberDetail, will fallback to raw map", "doc", doc.Ref.ID, "error", err)
		//
		// // fallback: minimal summary from raw map (map[string]any を直接読む)
		// m := doc.Data()
		// // asString/asStringSlice で型を"それっぽく"合わせて MemberSummary を作る
		// s := api.MemberSummary{
		// 	Id:       doc.Ref.ID,
		// 	Name:     asString(m["name"]),
		// 	Nickname: asString(m["nickname"]),
		// 	Roles:    asStringSlice(m["roles"]),
		// }
		// if avatar := asString(m["avatar"]); avatar != "" {
		// 	s.Avatar = &avatar
		// }
		// out = append(out, s)

		// AFTER（現在：壊れたdocは skip）
		slog.Warn("failed to parse document into MemberDetail, skip", "doc", doc.Ref.ID, "error", err)
		continue
	}

	// --- ⑥ ループ完了：正常に取れた分だけ返す ---
	c.JSON(http.StatusOK, out)
}

// 機能：Firestore の "members" コレクションから指定IDのドキュメントを読み込み、api.MemberDetail として返す。
func (h *Handler) GetApiMembersId(c *gin.Context, id string) {
	// --- ① Firestore へ問い合わせるための Context を用意 ---
	ctx := c.Request.Context()

	// --- ② 指定IDのドキュメントを1件取得 ---
	// members/{id} を取得する（存在しない/権限がない/通信エラーなどがありうる）
	docSnap, err := h.fs.Collection("members").Doc(id).Get(ctx)
	if err != nil {
		// --- ②-1 そのIDのドキュメントが存在しない場合 ---
		// 「サーバの故障」ではなく「指定されたリソースがない」ので 404 を返す
		if status.Code(err) == codes.NotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "member not found"})
			return
		}

		// --- ②-2 それ以外の取得エラー ---
		// 例：Firestoreへの通信失敗、権限不足、一時障害など
		// この場合は APIとして処理を完了できないので 500 を返す
		// （本番運用では err.Error() を返さず、ログに詳細を出す形にすることが多い）
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// --- ③ 取得したドキュメントを struct(api.MemberDetail) にデコード（型変換） ---
	// Firestore上のデータ型が struct と一致しないと失敗する
	// 例：roles が []string ではなく string だった、name が number だった、など
	var d api.MemberDetail
	if err := docSnap.DataTo(&d); err != nil {
		// --- ③-1 デコード失敗 ---
		// 詳細取得APIは「その1件が返せない」= API失敗なので、ログをErrorで残して500
		slog.Error("failed to parse member document", "doc", docSnap.Ref.ID, "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// --- ④ レスポンスに必要な補完（IDが空ならdocIDを入れる） ---
	// Firestoreのフィールドに id が入っていない/空でも、docのIDを返すようにする
	if d.Id == "" {
		d.Id = docSnap.Ref.ID
	}

	// --- ⑤ 正常終了：MemberDetail を返す（200） ---
	c.JSON(http.StatusOK, d)
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
// 以下はエラーハンドリングを修正したので、削除
////////////////////////////////////////////////////
////////////////////////////////////////////////////

// // ヘルパー関数：asString
// // 機能：any型の値を文字列に変換する。nilの場合は空文字列を返す。
// // 引数：v - 変換対象の値
// // 戻り値：変換後の文字列

// func asString(v any) string {
// 	if v == nil {
// 		return ""
// 	}
// 	if s, ok := v.(string); ok {
// 		return s
// 	}
// 	// fallback: try to stringify other primitive values
// 	return fmt.Sprint(v)
// }

// // ヘルパー関数：asStringSlice
// // 機能：any型の値を文字列スライスに変換する。nilの場合は空のスライスを返す。
// // 引数：v - 変換対象の値
// // 戻り値：変換後の文字列スライス

// func asStringSlice(v any) []string {
// 	if v == nil {
// 		return []string{}
// 	}
// 	if a, ok := v.([]any); ok {
// 		out := make([]string, 0, len(a))
// 		for _, x := range a {
// 			if s, ok := x.(string); ok {
// 				out = append(out, s)
// 			}
// 		}
// 		return out
// 	}
// 	if ss, ok := v.([]string); ok {
// 		return ss
// 	}
// 	return []string{}
// }
