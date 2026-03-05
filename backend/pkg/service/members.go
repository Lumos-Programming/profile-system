package service

import (
	"context"

	"cloud.google.com/go/firestore"
)

// MembersService は Firestore の "members" コレクションに対する操作を提供する。
type MembersService struct {
	fs *firestore.Client
}

// NewMembersService は MembersService を生成する。
func NewMembersService(fs *firestore.Client) *MembersService {
	return &MembersService{fs: fs}
}

// Register は Member を Firestore の "members" コレクションに登録する。
// 戻り値はドキュメントIDとエラー。
func (s *MembersService) Register(ctx context.Context, m Member) (string, error) {
	doc := s.fs.Collection("members").NewDoc()
	m.Id = doc.ID // Firestore のドキュメント ID を id フィールドにも保持
	_, err := doc.Set(ctx, m)
	if err != nil {
		return "", err
	}
	return doc.ID, nil
}
