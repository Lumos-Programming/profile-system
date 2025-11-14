package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"cloud.google.com/go/firestore"
	"github.com/Lumos-Programming/profile-system-backend/api"
	"github.com/Lumos-Programming/profile-system-backend/pkg/config"
	"github.com/Lumos-Programming/profile-system-backend/pkg/handler"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/api/option"
)

const (
	authCookieName = "auth_token"
)

// jwtSecret は開発用の HMAC シークレットです。実運用では環境変数やシークレットマネージャで管理してください。
var jwtSecret = []byte("dummy_secret")

func main() {
	ctx := context.Background()

	cfg, err := config.Load()
	if err != nil {
		slog.Error("Config load error", "error", err)
		os.Exit(1)
	}

	opts := option.WithCredentialsFile(cfg.Firestore.Credentials)
	client, err := firestore.NewClient(ctx, cfg.Firestore.ProjectID, opts)
	if err != nil {
		slog.Error("Firestore client error", "error", err)
		os.Exit(1)
	}

	router := setupAPIServer(client)

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: router.Handler(),
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("Server listen error", "error", err)
			os.Exit(1)
			return
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	slog.Info("Shutdown Server...")
	client.Close()
}

func setupAPIServer(client *firestore.Client) *gin.Engine {
	h := handler.NewHandler(client)
	router := gin.Default()
	api.RegisterHandlers(router, h)
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
	})
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	api := router.Group("/api") // 以下のapiグループをまとめる

	//api.Use(authHandler)

	// "/api/dummy/auth" エンドポイントを追加
	api.POST("/dummy/auth", func(c *gin.Context) {
		// ダミーのJWTトークンを生成（本番では適切な署名・ペイロードを使うこと）
		dummyToken := "dummy.jwt.token"

		// クッキーにセット
		c.SetCookie("auth_token", dummyToken, 3600, "/", "", false, true)

		c.JSON(200, gin.H{
			"token": dummyToken,
		})
	})

	// JWTトークンを生成する
	api.POST("/jwt/generate", func(c *gin.Context) {
		// 本番では秘密鍵を安全に管理し、ペイロードも適切に設定してください
		// ここでは簡易なダミーペイロードと署名で生成します
		// 例: github.com/golang-jwt/jwt/v5 を利用
		type Claims struct {
			UserID string `json:"user_id"`
			jwt.RegisteredClaims
		}

		// ダミーユーザーID
		userID := "dummy_user_id"

		claims := Claims{
			UserID:           userID,
			RegisteredClaims: jwt.RegisteredClaims{
				// 有効期限など必要に応じて設定
			},
		}

		// シークレットキー（本番では環境変数などで管理）
		secret := []byte("dummy_secret")

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(secret)
		if err != nil {
			c.JSON(500, gin.H{"error": "failed to generate token"})
			return
		}

		// クッキーにセット
		c.SetCookie("auth_token", tokenString, 3600, "/", "", false, true)

		c.JSON(200, gin.H{
			"token": tokenString,
		})
	})

	// SetCookieメゾットでginに返す
	api.GET("/set-cookie", func(c *gin.Context) {
		c.SetCookie("sample_cookie", "sample_value", 3600, "/", "", false, true)
		c.JSON(200, gin.H{
			"message": "Cookie set successfully",
		})
	})

	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(http.StatusNoContent)
	})

	return router
}

type Claims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// authHandler はJWTトークンを検証し、ユーザーIDをコンテキストにセットします。
func authHandler(c *gin.Context) {
	tokenString, err := c.Cookie(authCookieName)
	if err != nil || tokenString == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing auth token"})
		return
	}

	var claims Claims
	token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (interface{}, error) {
		// 署名方式をチェック（HMAC）
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
		return
	}

	c.Set("user_id", claims.UserID)
	c.Next()
}
