# API仕様書 - サークルプロフィール管理システム

## 概要
このドキュメントは、サークルプロフィール管理システムのフロントエンドとバックエンド間のAPI通信仕様を定義します。

## ベースURL
- 開発環境: `http://localhost:3001`
- 本番環境: `https://your-domain.com`

## 共通仕様

### レスポンスフォーマット
- 成功時: HTTPステータス 200, JSON形式
- エラー時: 適切なHTTPステータスコード + エラーメッセージ

### エラーレスポンス形式
```json
{
  "error": "エラーメッセージ",
  "code": "ERROR_CODE",
  "details": "詳細情報（オプション）"
}
```

---

## 1. メンバー情報API

### GET /api/members
メンバー一覧を取得します。

**フロントエンド実装箇所:**
- `components/member-list.tsx` の `useEffect` 内
- API失敗時はモックデータにフォールバック

**リクエスト:**
```http
GET /api/members HTTP/1.1
```

**レスポンス:**
```json
[
  {
    "id": "string",
    "name": "string",
    "nickname": "string", 
    "department": "string",
    "year": "string",
    "roles": ["string"],
    "bio": "string (Markdown対応)",
    "avatar": "string (URL, オプション)",
    "accounts": {
      "lineUrl": "string (オプション)",
      "discordUrl": "string (オプション)", 
      "githubUrl": "string (オプション)",
      "discordAvatarUrl": "string (オプション)",
      "discordUsername": "string (オプション)"
    },
    "links": [
      {
        "title": "string",
        "url": "string"
      }
    ],
    "events": [
      {
        "name": "string",
        "date": "string (YYYY-MM-DD形式)",
        "status": "upcoming | completed"
      }
    ]
  }
]
```

**フロントエンドでの使用:**
- メンバーカードの表示
- メンバー詳細ダイアログの情報
- アバターは `discordAvatarUrl` > `avatar` > `/placeholder-user.jpg` の優先順位
- 表示名は `discordUsername` > `name` の優先順位

---

## 2. プロフィール設定API（今後実装予定）

### GET /api/profile
現在のユーザーのプロフィール情報を取得

**想定リクエスト:**
```http
GET /api/profile HTTP/1.1
Authorization: Bearer {token}
```

**想定レスポンス:**
```json
{
  "studentId": "string",
  "lastName": "string",
  "firstName": "string", 
  "nickname": "string",
  "department": "string",
  "bio": "string (Markdown対応)",
  "privacy": {
    "studentId": "boolean",
    "name": "boolean",
    "nickname": "boolean", 
    "department": "boolean",
    "bio": "boolean"
  },
  "accounts": {
    "lineUrl": "string (オプション)",
    "discordUrl": "string (オプション)",
    "githubUrl": "string (オプション)",
    "discordAvatarUrl": "string (オプション)",
    "discordUsername": "string (オプション)"
  }
}
```

### PUT /api/profile
プロフィール情報を更新

**想定リクエスト:**
```http
PUT /api/profile HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "lastName": "string",
  "firstName": "string",
  "nickname": "string", 
  "department": "string",
  "bio": "string (最大500文字, Markdown対応)",
  "privacy": {
    "studentId": "boolean",
    "name": "boolean", 
    "nickname": "boolean",
    "department": "boolean",
    "bio": "boolean"
  }
}
```

**フロントエンド実装箇所:**
- `components/profile-edit.tsx` の `handleSave` 関数

---

## 3. イベント管理API（今後実装予定）

### GET /api/events
イベント一覧を取得

**想定レスポンス:**
```json
[
  {
    "id": "string",
    "title": "string", 
    "description": "string",
    "date": "string (ISO 8601形式)",
    "location": "string",
    "maxParticipants": "number (オプション)",
    "participants": [
      {
        "userId": "string",
        "status": "registered | attended | cancelled"
      }
    ],
    "createdBy": "string (userId)",
    "createdAt": "string (ISO 8601形式)"
  }
]
```

### POST /api/events
新しいイベントを作成

### PUT /api/events/{eventId}/participate
イベントへの参加登録

---

## 4. 認証API（今後実装予定）

### POST /api/auth/login
管理者ログイン

**リクエスト:**
```json
{
  "username": "string",
  "password": "string"
}
```

**レスポンス:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "role": "admin | user",
    "name": "string"
  }
}
```

**フロントエンド実装箇所:**
- `components/admin-login.tsx`
- `app/admin/page.tsx` の認証状態管理

---

## フロントエンド実装の詳細

### 1. 状態管理
- React の `useState` と `useEffect` を使用
- API失敗時のフォールバック機能あり

### 2. データフロー
```
API呼び出し → JSON解析 → 状態更新 → UI再レンダリング
     ↓（失敗時）
  モックデータ使用
```

### 3. UI生成箇所

**メンバー一覧 (`/members`):**
- カード表示: `members.map()` でメンバーカード生成
- アイコン表示: `accounts.lineUrl`, `accounts.discordUrl`, `accounts.githubUrl` の有無で表示制御
- クリック時: 詳細ダイアログ表示

**プロフィール設定 (`/setting`):**
- 編集モード: フォーム入力
- プレビューモード: Markdown レンダリング（`ReactMarkdown` + `remark-gfm` + `rehype-highlight`）

### 4. 現在のモックデータ
`components/member-list.tsx` 内の `mockMembers` 配列に以下のサンプルデータ:
- 6名のメンバー情報
- 各種SNSリンク
- Discord アバターURL
- Markdown形式の自己紹介

---

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 15.2.4 (App Router)
- **UI**: Radix UI + Tailwind CSS + Tailwind Typography
- **Markdown**: react-markdown + remark-gfm + rehype-highlight + rehype-raw
- **アイコン**: Lucide React

### 必要なバックエンド機能
1. **認証・認可**: JWT トークンベース
2. **データベース**: メンバー情報、イベント情報の永続化
3. **ファイルアップロード**: アバター画像（Discord連携で不要の可能性）
4. **SNS連携**: Discord, LINE, GitHub のOAuth（オプション）

---

## 注意事項

### セキュリティ
- 個人情報の取り扱いに注意（プライバシー設定の尊重）
- パスワードの適切なハッシュ化
- CORS設定の適切な構成

### パフォーマンス
- メンバー数が多い場合のページネーション対応
- 画像の適切な圧縮・CDN配信

### データ整合性
- Markdown入力のサニタイゼーション
- 文字数制限の実装（bio: 500文字）
- URLの妥当性チェック

---

## 開発の進め方

1. **Phase 1**: メンバー情報API (`GET /api/members`) の実装
2. **Phase 2**: プロフィール設定API (`GET/PUT /api/profile`) の実装  
3. **Phase 3**: 認証機能の実装
4. **Phase 4**: イベント管理機能の実装

各フェーズ完了時点で、フロントエンドの該当機能をモックからAPI連携に切り替え。