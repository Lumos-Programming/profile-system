"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, MessageSquare, Github, Eye, EyeOff, Save, Edit3, Monitor } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"

interface LinkItem {
  id: string
  title: string
  url: string
}

export default function ProfileEdit() {
  const [isEditMode, setIsEditMode] = useState(true)
  const [profile, setProfile] = useState({
    studentId: "B1234567",
    lastName: "田中",
    firstName: "太郎",
    nickname: "たなたろ",
    department: "情報工学部",
    bio: `# 自己紹介

プログラミングが好きな2年生です！

## 興味のある分野
- **Webアプリ開発**
- **機械学習**
- **UI/UXデザイン**

## 最近の活動
- サークルのWebサイト制作
- ハッカソン参加

よろしくお願いします！ 🚀`,
    privacy: {
      studentId: false,
      name: true,
      nickname: true,
      department: true,
      bio: true,
    },
      accounts: {
        line: { connected: true, id: "tanaka_taro" },
        discord: { connected: true, id: "tanaka#1234" },
        github: { connected: true, id: "tanaka-dev" },
      },
  })


  const togglePrivacy = (field: keyof typeof profile.privacy) => {
    setProfile((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: !prev.privacy[field],
      },
    }))
  }

  const handleSave = () => {
    // 保存処理
    setIsEditMode(false)
  }

  return (
    <div className="space-y-6">
      {/* モード切り替え */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <Tabs value={isEditMode ? "edit" : "preview"} onValueChange={(value) => setIsEditMode(value === "edit")}>
            <TabsList className="grid w-full grid-cols-2 rounded-lg">
              <TabsTrigger value="edit" className="rounded-lg flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                編集モード
              </TabsTrigger>
              <TabsTrigger value="preview" className="rounded-lg flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                プレビューモード
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {isEditMode ? (
        <>
          {/* 基本情報 - 編集モード */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-indigo-600" />
                基本情報
              </CardTitle>
              <CardDescription>あなたの基本的なプロフィール情報を設定してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="studentId">学籍番号</Label>
                    <div className="flex items-center gap-2">
                      <Switch checked={profile.privacy.studentId} onCheckedChange={() => togglePrivacy("studentId")} />
                      {profile.privacy.studentId ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <Input
                    id="studentId"
                    value={profile.studentId}
                    onChange={(e) => setProfile((prev) => ({ ...prev, studentId: e.target.value }))}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="department">学部</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={profile.privacy.department}
                        onCheckedChange={() => togglePrivacy("department")}
                      />
                      {profile.privacy.department ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <Select
                    value={profile.department}
                    onValueChange={(value) => setProfile((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="情報工学部">情報工学部</SelectItem>
                      <SelectItem value="経済学部">経済学部</SelectItem>
                      <SelectItem value="文学部">文学部</SelectItem>
                      <SelectItem value="理学部">理学部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lastName">苗字</Label>
                    <div className="flex items-center gap-2">
                      <Switch checked={profile.privacy.name} onCheckedChange={() => togglePrivacy("name")} />
                      {profile.privacy.name ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">名前</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="nickname">ニックネーム</Label>
                  <div className="flex items-center gap-2">
                    <Switch checked={profile.privacy.nickname} onCheckedChange={() => togglePrivacy("nickname")} />
                    {profile.privacy.nickname ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <Input
                  id="nickname"
                  value={profile.nickname}
                  onChange={(e) => setProfile((prev) => ({ ...prev, nickname: e.target.value }))}
                  className="rounded-lg"
                  placeholder="みんなに呼ばれたい名前"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio">自己紹介（Markdown対応）</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{profile.bio.length}/500</span>
                    <Switch checked={profile.privacy.bio} onCheckedChange={() => togglePrivacy("bio")} />
                    {profile.privacy.bio ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value.slice(0, 500) }))}
                  className="rounded-lg min-h-[150px] font-mono text-sm"
                  placeholder="Markdownで自己紹介を書いてください..."
                />
                <p className="text-xs text-gray-500">Markdown記法が使用できます（見出し、太字、リスト、リンクなど）</p>
              </div>
            </CardContent>
          </Card>

          {/* アカウント連携 - 編集モード */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                アカウント連携
              </CardTitle>
              <CardDescription>他のサービスとアカウントを連携してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* LINE（必須） */}
                <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">LINE</div>
                      <div className="text-sm text-gray-600">
                        {profile.accounts.line.connected ? profile.accounts.line.id : "未連携"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      必須
                    </Badge>
                    <Badge variant={profile.accounts.line.connected ? "default" : "secondary"}>
                      {profile.accounts.line.connected ? "連携済み" : "未連携"}
                    </Badge>
                  </div>
                </div>

                {/* Discord（必須） */}
                <div className="flex items-center justify-between p-3 rounded-lg border bg-indigo-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Discord</div>
                      <div className="text-sm text-gray-600">
                        {profile.accounts.discord.connected ? profile.accounts.discord.id : "未連携"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      必須
                    </Badge>
                    <Badge variant={profile.accounts.discord.connected ? "default" : "secondary"}>
                      {profile.accounts.discord.connected ? "連携済み" : "未連携"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* GitHub（任意） */}
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Github className="w-8 h-8 text-gray-700" />
                    <div>
                      <div className="font-medium">GitHub</div>
                      <div className="text-sm text-gray-600">
                        {profile.accounts.github.connected ? profile.accounts.github.id : "未連携"}
                      </div>
                    </div>
                  </div>
                  <Badge variant={profile.accounts.github.connected ? "default" : "secondary"}>
                    {profile.accounts.github.connected ? "連携済み" : "未連携"}
                  </Badge>
                </div>

                {/* Instagram と X を削除しました。LINE / Discord / GitHub のみ表示 */}
              </div>
            </CardContent>
          </Card>


          {/* 保存ボタン */}
          <div className="flex justify-center">
            <Button size="lg" className="rounded-full px-8" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              プロフィールを保存
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* プレビューモード */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-indigo-600" />
                プロフィールプレビュー
              </CardTitle>
              <CardDescription>他のメンバーからはこのように見えます（公開設定を反映）</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本情報プレビュー */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {profile.firstName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {profile.privacy.name ? `${profile.lastName} ${profile.firstName}` : "非公開"}
                    </h2>
                    <p className="text-gray-600">@{profile.privacy.nickname ? profile.nickname : "非公開"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">学籍番号</Label>
                    <p className="text-sm">{profile.privacy.studentId ? profile.studentId : "非公開"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">学部</Label>
                    <p className="text-sm">{profile.privacy.department ? profile.department : "非公開"}</p>
                  </div>
                </div>

                {profile.privacy.bio && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">自己紹介</Label>
                    <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
                        {profile.bio}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

              {/* アカウント連携プレビュー */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">連携アカウント</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.accounts.line.connected && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      <span className="text-sm">LINE</span>
                    </div>
                  )}
                  {profile.accounts.discord.connected && (
                    <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm">Discord</span>
                    </div>
                  )}
                  {profile.accounts.github.connected && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Github className="w-4 h-4 text-gray-700" />
                      <span className="text-sm">GitHub</span>
                    </div>
                  )}
                </div>
              </div>

              {/* お気に入りリンクのプレビューは削除されました */}

              {/* 参加イベント履歴は削除されました */}
            </CardContent>
          </Card>

          {/* 編集モードに戻るボタン */}
          <div className="flex justify-center">
            <Button size="lg" variant="outline" className="rounded-full px-8" onClick={() => setIsEditMode(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              編集モードに戻る
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
