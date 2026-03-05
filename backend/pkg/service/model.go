package service

import api "github.com/Lumos-Programming/profile-system-backend/api"

// Member は Firestore に保存するメンバー情報の構造体。
// firestore タグで Firestore フィールド名を明示する。
type Member struct {
	Accounts struct {
		Discord bool `firestore:"discord"`
		Github  bool `firestore:"github"`
		Line    bool `firestore:"line"`
	} `firestore:"accounts"`
	Avatar     *string `firestore:"avatar,omitempty"`
	Bio        string  `firestore:"bio"`
	Department string  `firestore:"department"`
	Id         string  `firestore:"id"`
	Links      []struct {
		Title string `firestore:"title"`
		Url   string `firestore:"url"`
	} `firestore:"links"`
	Name     string   `firestore:"name"`
	Nickname string   `firestore:"nickname"`
	Roles    []string `firestore:"roles"`
	Year     string   `firestore:"year"`
}

// ToSummary は Member を API レスポンス用の MemberSummary に変換する。
func (m *Member) ToSummary() api.MemberSummary {
	return api.MemberSummary{
		Id:       m.Id,
		Name:     m.Name,
		Nickname: m.Nickname,
		Roles:    m.Roles,
		Avatar:   m.Avatar,
	}
}

// ToDetail は Member を API レスポンス用の MemberDetail に変換する。
func (m *Member) ToDetail() api.MemberDetail {
	detail := api.MemberDetail{
		Id:         m.Id,
		Name:       m.Name,
		Nickname:   m.Nickname,
		Department: m.Department,
		Year:       m.Year,
		Bio:        m.Bio,
		Avatar:     m.Avatar,
		Roles:      m.Roles,
	}
	detail.Accounts.Discord = m.Accounts.Discord
	detail.Accounts.Github = m.Accounts.Github
	detail.Accounts.Line = m.Accounts.Line

	for _, l := range m.Links {
		detail.Links = append(detail.Links, struct {
			Title string `json:"title"`
			Url   string `json:"url"`
		}{Title: l.Title, Url: l.Url})
	}

	return detail
}

// MemberFromAPICreate は api.MemberCreate を Member に変換する。
func MemberFromAPICreate(req api.MemberCreate) Member {
	m := Member{
		Name:       req.Name,
		Nickname:   req.Nickname,
		Department: req.Department,
		Year:       req.Year,
		Bio:        req.Bio,
		Roles:      req.Roles,
		Avatar:     req.Avatar,
	}
	m.Accounts.Discord = req.Accounts.Discord
	m.Accounts.Github = req.Accounts.Github
	m.Accounts.Line = req.Accounts.Line

	if req.Links != nil {
		for _, l := range *req.Links {
			m.Links = append(m.Links, struct {
				Title string `firestore:"title"`
				Url   string `firestore:"url"`
			}{Title: l.Title, Url: l.Url})
		}
	}
	return m
}
