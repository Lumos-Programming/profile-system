package jwt

import (
	"fmt"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func TestJWT_IssueAndAuthenticate(t *testing.T) {
	claims := jwt.RegisteredClaims{
		Subject:   "TestSubject",
		Issuer:    "TestIssuer",
		IssuedAt:  jwt.NewNumericDate(time.Now().Add(-5 * time.Hour)),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
	}
	secret := "testSecret"

	// Manager を作成して JWT 発行
	m := &Manager{secret: []byte(secret)}
	tokenString, err := m.IssueJWT(Claims{RegisteredClaims: claims})
	assert.NoError(t, err)
	assert.NotEmpty(t, tokenString)
	// JWT をターミナルに出力
	fmt.Println("Issued JWT:", tokenString)

	// 正しいシークレットで認証
	gotClaims, err := m.AuthenticateJWT(tokenString)
	assert.NoError(t, err)
	// AuthenticateJWT は *Claims を返すため Subject をチェック
	assert.Equal(t, claims.Subject, gotClaims.Subject)

	// 不正なシークレットで認証（失敗するはず）
	m2 := &Manager{secret: []byte("wrongSecret")}
	token2, err2 := m2.AuthenticateJWT(tokenString) //
	assert.Error(t, err2)
	assert.Nil(t, token2) // token2 が nil であること」をアサート（検証）します
}

func TestCreateClaims(t *testing.T) {
	tests := []struct {
		name   string
		id     string
		secret string
	}{
		{
			name:   "test1",
			id:     "testing123",
			secret: "ThisIsSecret",
		},
		{
			name:   "test2",
			id:     "こんばんは",
			secret: "あああ",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Manager を使って発行・検証する
			m := &Manager{secret: []byte(tt.secret)}
			claims := CreateClaims(tt.id, "testIssuer")
			got, err := m.IssueJWT(claims)
			if err != nil {
				t.Errorf("IssueJWT() error = %v", err)
				return
			}
			// テスト用に発行した JWT をターミナルに出力
			fmt.Printf("[%s] Issued JWT: %s\n", tt.name, got)
			verify, err := m.AuthenticateJWT(got)
			assert.NoError(t, err)
			assert.Equal(t, claims.UserID, verify.UserID)
		})
	}
}
