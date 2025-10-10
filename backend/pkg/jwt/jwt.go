package jwt

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

type Manager struct {
	secret []byte `json:"student_id"`
}

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// JWTトークンを認証するだけの関数例
func (m *Manager) AuthenticateJWT(tokenString string) (*Claims, error) {
	// Claims 構造体に直接パースして、検証済みのクレームを返す
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// 署名方式がHMACかどうかをチェック
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		// 検証用のシークレットを返す
		return m.secret, nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}

// 任意のclaimsとsecretでJWTを発行する本番用関数
func (m *Manager) IssueJWT(claims Claims) (string, error) {
	// 1. 指定したクレームで新しいJWTトークンを作成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 2. シークレットでトークンに署名し、JWT文字列を生成
	tokenString, err := token.SignedString(m.secret)
	if err != nil {
		// 3. 署名に失敗した場合はエラーを返す
		return "", err
	}

	// 4. 正常に生成できた場合はJWT文字列を返す
	return tokenString, nil
}

func CreateClaims(userID string, issuer string) Claims {
	return Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:  issuer,
			Subject: userID, // 必要に応じて
			// ID:     uuid等を入れたい場合はここに
		},
	}
}

// 以下は過去の実装例（コメントアウト）です。参考用に残しています。
// 日本語の説明を付け加えています。
//
// CreateClaims
// - 目的: `jwt.StandardClaims` を用いて基本的なクレーム（ID、発行者、発行時間、失効時間）を作成するヘルパー関数の例。
// - 引数:
//   - `id string`: トークンの一意な ID（例: ユーザーIDやセッションID）。
//   - `duration time.Duration`: トークンの有効期限（現在時刻からの相対時間）。
//   - `issuer string`: トークン発行者の識別子（例: サービス名）。
// - 戻り値: `jwt.StandardClaims`（古い `github.com/dgrijalva/jwt-go` 系列での標準クレーム構造体と互換のある型）
// - 備考: このコードは `jwt.StandardClaims` を返しますが、このファイルでは新しい `jwt.RegisteredClaims` を使っているため
//   実運用では `RegisteredClaims` に置き換えるのが望ましいです（フィールド名や型が異なります）。
// func CreateClaims(id string, duration time.Duration, issuer string) jwt.StandardClaims {
// 	return jwt.StandardClaims{
// 		Id:        id,
// 		Issuer:    issuer,
// 		ExpiresAt: time.Now().Add(duration).Unix(),
// 		IssuedAt:  time.Now().Unix(),
// 	}
// }

// IssueJWT
// - 目的: 任意の `jwt.Claims` を与えて HMAC-SHA256（HS256）で署名した JWT を発行する簡易関数の例。
// - 引数:
//   - `claims jwt.Claims`: トークンに含めるクレーム（カスタム構造体や `jwt.StandardClaims` / `jwt.RegisteredClaims`）。
//   - `secret string`: 署名に使うシークレット（HMAC のキー）。
// - 戻り値: 署名済み JWT 文字列またはエラー。
// - 備考: 実運用ではシークレットを文字列で渡すより `[]byte` を使い、シークレット管理を安全に行ってください。
// func IssueJWT(claims jwt.Claims, secret string) (string, error) {
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString([]byte(secret))
// 	if err != nil {
// 		return "", err
// 	}
// 	return tokenString, nil
// }

// Verify
// - 目的: 受け取った JWT 文字列をパースし、署名方式とシークレットを検証のうえ、`jwt.StandardClaims` として検証済みクレームを返す例。
// - 引数:
//   - `j string`: 受け取った JWT 文字列。
//   - `secret string`: 検証に使うシークレット（HMAC のキー）。
// - 戻り値: 検証に成功した `*jwt.StandardClaims` またはエラー。
// - 備考:
//   - `jwt.ParseWithClaims` に渡す検証関数内で署名方式をチェックしています（HMAC でない場合はエラー）。
//   - `token.Claims.Valid()` でクレームの妥当性（失効時間など）を確認します。
//   - こちらも `StandardClaims` を使用していますが、このコードベースでは `RegisteredClaims` を使うほうが新しい jwt ライブラリに合っています。
//   - 実運用ではエラー型やメッセージをより詳細に扱い、ロギングや監査を追加してください。
// func Verify(j string, secret string) (*jwt.StandardClaims, error) {
// 	token, err := jwt.ParseWithClaims(j, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
// 		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// 			return "", errors.New("UNEXPECTED SIGNING METHOD")
// 		}
// 		return []byte(secret), nil
// 	})
// 	if err != nil {
// 		return nil, exception.ErrInvalidJWT
// 	}
// 	if err = token.Claims.Valid(); err != nil {
// 		return nil, exception.ErrInvalidJWT
// 	}
// 	standardC, ok := token.Claims.(*jwt.StandardClaims)
// 	if !ok {
// 		return nil, exception.ErrInvalidJWT
// 	}
// 	return standardC, nil
// }
