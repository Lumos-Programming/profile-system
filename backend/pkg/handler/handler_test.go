package handler

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Lumos-Programming/profile-system-backend/api"
	"github.com/Lumos-Programming/profile-system-backend/pkg/config"
	"github.com/gin-gonic/gin"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (f roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}

func TestGetApiLineOauth_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)

	h := NewHandler(nil, config.LINE{
		ChannelID:     "line_channel_id",
		ChannelSecret: "line_channel_secret",
		RedirectURI:   "http://localhost:8080/api/line-oauth",
	})

	h.httpClient = &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			switch req.URL.String() {
			case "https://api.line.me/oauth2/v2.1/token":
				if req.Method != http.MethodPost {
					t.Fatalf("unexpected method for token endpoint: %s", req.Method)
				}
				b, _ := io.ReadAll(req.Body)
				if !strings.Contains(string(b), "code=auth_code") {
					t.Fatalf("token request does not include code: %s", string(b))
				}
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(strings.NewReader(`{"access_token":"access-token","expires_in":3600,"refresh_token":"refresh-token"}`)),
					Header:     make(http.Header),
				}, nil
			case "https://api.line.me/v2/profile":
				if req.Header.Get("Authorization") != "Bearer access-token" {
					t.Fatalf("unexpected authorization header: %s", req.Header.Get("Authorization"))
				}
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(strings.NewReader(`{"userId":"U123","displayName":"Taro","pictureUrl":"https://example.com/pic.png","statusMessage":"hello"}`)),
					Header:     make(http.Header),
				}, nil
			default:
				return &http.Response{
					StatusCode: http.StatusNotFound,
					Body:       io.NopCloser(strings.NewReader(`{"error":"not found"}`)),
					Header:     make(http.Header),
				}, nil
			}
		}),
	}

	r := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(r)
	c.Request = httptest.NewRequest(http.MethodGet, "/api/line-oauth?code=auth_code", nil)

	h.GetApiLineOauth(c, api.GetApiLineOauthParams{Code: "auth_code"})

	if r.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d, body=%s", http.StatusOK, r.Code, r.Body.String())
	}

	var got api.LineOAuthResponse
	if err := json.Unmarshal(r.Body.Bytes(), &got); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}

	if got.AccessToken != "access-token" {
		t.Fatalf("unexpected access token: %s", got.AccessToken)
	}
	if got.User.UserId != "U123" {
		t.Fatalf("unexpected user id: %s", got.User.UserId)
	}
}

func TestGetApiLineOauth_MissingConfig(t *testing.T) {
	gin.SetMode(gin.TestMode)

	h := NewHandler(nil, config.LINE{})

	r := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(r)
	c.Request = httptest.NewRequest(http.MethodGet, "/api/line-oauth?code=auth_code", nil)

	h.GetApiLineOauth(c, api.GetApiLineOauthParams{Code: "auth_code"})

	if r.Code != http.StatusInternalServerError {
		t.Fatalf("expected status %d, got %d", http.StatusInternalServerError, r.Code)
	}
}
