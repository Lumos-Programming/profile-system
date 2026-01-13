package handler

import (
	"context"
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
	ctx := context.Background()
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
	ctx := context.Background()
	docSnap, err := h.fs.Collection("members").Doc(id).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "member not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var d api.MemberDetail
	if err := docSnap.DataTo(&d); err != nil {
		slog.Error("failed to parse member document", "doc", docSnap.Ref.ID, "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if d.Id == "" {
		d.Id = docSnap.Ref.ID
	}
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
