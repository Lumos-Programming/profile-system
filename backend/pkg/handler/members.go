package handler

import (
	"context"
	"net/http"

	api "github.com/Lumos-Programming/profile-system-backend/api"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// GetApiMembers returns list of api.MemberSummary, mapping from Firestore.
func (h *Handler) GetApiMembers(c *gin.Context) {
	ctx := context.Background()
	iter := h.fs.Collection("members").Documents(ctx)
	defer iter.Stop()

	out := make([]api.MemberSummary, 0)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		var d api.MemberDetail
		if err := doc.DataTo(&d); err == nil {
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

		// fallback: minimal summary from raw map
		m := doc.Data()
		s := api.MemberSummary{
			Id:       doc.Ref.ID,
			Name:     asString(m["name"]),
			Nickname: asString(m["nickname"]),
			Roles:    asStringSlice(m["roles"]),
		}
		if avatar := asString(m["avatar"]); avatar != "" {
			s.Avatar = &avatar
		}
		out = append(out, s)
	}

	c.JSON(http.StatusOK, out)
}

// GetApiMembersId returns api.MemberDetail for id.
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if d.Id == "" {
		d.Id = docSnap.Ref.ID
	}
	c.JSON(http.StatusOK, d)
}

func asString(v any) string {
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}
func asStringSlice(v any) []string {
	if v == nil {
		return []string{}
	}
	if a, ok := v.([]any); ok {
		out := make([]string, 0, len(a))
		for _, x := range a {
			if s, ok := x.(string); ok {
				out = append(out, s)
			}
		}
		return out
	}
	if ss, ok := v.([]string); ok {
		return ss
	}
	return []string{}
}
