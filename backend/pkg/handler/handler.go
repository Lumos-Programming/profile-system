package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/Lumos-Programming/profile-system-backend/api"
	"github.com/Lumos-Programming/profile-system-backend/pkg/config"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const (
	firestoreCollection = "profiles"
	firestoreDocID      = "default" // 単一プロフィールの場合
)

type Handler struct {
	fs         *firestore.Client
	httpClient *http.Client
	lineCfg    config.LINE
}

func NewHandler(f *firestore.Client, lineCfg config.LINE) *Handler {
	return &Handler{
		fs: f,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		lineCfg: lineCfg,
	}
}

type lineTokenResponse struct {
	AccessToken  string `json:"access_token"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

type lineProfileResponse struct {
	UserID        string `json:"userId"`
	DisplayName   string `json:"displayName"`
	PictureURL    string `json:"pictureUrl"`
	StatusMessage string `json:"statusMessage"`
}

func (h *Handler) GetApiLineOauth(c *gin.Context, params api.GetApiLineOauthParams) {
	channelID := h.lineCfg.ChannelID
	channelSecret := h.lineCfg.ChannelSecret
	redirectURI := h.lineCfg.RedirectURI

	if channelID == "" || channelSecret == "" || redirectURI == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "LINE OAuth settings are not configured"})
		return
	}

	tokenForm := url.Values{}
	tokenForm.Set("grant_type", "authorization_code")
	tokenForm.Set("code", params.Code)
	tokenForm.Set("redirect_uri", redirectURI)
	tokenForm.Set("client_id", channelID)
	tokenForm.Set("client_secret", channelSecret)

	tokenReq, err := http.NewRequestWithContext(c.Request.Context(), http.MethodPost, "https://api.line.me/oauth2/v2.1/token", strings.NewReader(tokenForm.Encode()))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	tokenReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	tokenRes, err := h.httpClient.Do(tokenReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer tokenRes.Body.Close()

	tokenBody, err := io.ReadAll(tokenRes.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if tokenRes.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("line token exchange failed: %s", string(tokenBody))})
		return
	}

	var token lineTokenResponse
	if err := json.Unmarshal(tokenBody, &token); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	profileReq, err := http.NewRequestWithContext(c.Request.Context(), http.MethodGet, "https://api.line.me/v2/profile", nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	profileReq.Header.Set("Authorization", "Bearer "+token.AccessToken)

	profileRes, err := h.httpClient.Do(profileReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer profileRes.Body.Close()

	profileBody, err := io.ReadAll(profileRes.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if profileRes.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("line profile fetch failed: %s", string(profileBody))})
		return
	}

	var profile lineProfileResponse
	if err := json.Unmarshal(profileBody, &profile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := api.LineOAuthResponse{
		AccessToken: token.AccessToken,
		ExpiresIn:   token.ExpiresIn,
		User: api.LineUser{
			UserId:      profile.UserID,
			DisplayName: profile.DisplayName,
		},
	}
	if token.RefreshToken != "" {
		res.RefreshToken = &token.RefreshToken
	}
	if profile.PictureURL != "" {
		res.User.PictureUrl = &profile.PictureURL
	}
	if profile.StatusMessage != "" {
		res.User.StatusMessage = &profile.StatusMessage
	}

	c.JSON(http.StatusOK, res)
}

func (h *Handler) GetApiProfileBasicInfo(c *gin.Context) {
	doc, err := h.fs.Collection(firestoreCollection).Doc(firestoreDocID).Get(c)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			c.JSON(200, api.BasicInfo{})
			return
		}
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	var info api.BasicInfo
	if err := doc.DataTo(&info); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, info)
}

func (h *Handler) PutApiProfileBasicInfo(c *gin.Context) {
	var req api.BasicInfo
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	_, err := h.fs.Collection(firestoreCollection).Doc(firestoreDocID).Set(c, req)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, req)
}
