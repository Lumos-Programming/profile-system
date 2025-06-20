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
import { User, MessageSquare, LinkIcon, Github, Instagram, Twitter, Eye, EyeOff, Save, Plus, X } from "lucide-react"

interface LinkItem {
  id: string
  title: string
  url: string
}

export default function ProfileEdit() {
  const [profile, setProfile] = useState({
    studentId: "B1234567",
    lastName: "田中",
    firstName: "太郎",
    nickname: "たなたろ",
    department: "情報工学部",
    bio: "プログラミングが好きな2年生です！Webアプリ開発に興味があります。",
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
      instagram: { connected: false, id: "" },
      twitter: { connected: false, id: "" },
    },
  })

  const [links, setLinks] = useState<LinkItem[]>([
    { id: "1", title: "個人ブログ", url: "https://tanaka-blog.com" },
    { id: "2", title: "ポートフォリオ", url: "https://tanaka-portfolio.dev" },
  ])

  const addLink = () => {
    if (links.length < 3) {
      setLinks([...links, { id: Date.now().toString(), title: "", url: "" }])
    }
  }

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const updateLink = (id: string, field: "title" | "url", value: string) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const togglePrivacy = (field: keyof typeof profile.privacy) => {
    setProfile((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: !prev.privacy[field],
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* 基本情報 */}
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
                  <Switch checked={profile.privacy.department} onCheckedChange={() => togglePrivacy("department")} />
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
              <Label htmlFor="bio">自己紹介</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{profile.bio.length}/140</span>
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
              onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value.slice(0, 140) }))}
              className="rounded-lg min-h-[100px]"
              placeholder="あなたについて教えてください..."
            />
          </div>
        </CardContent>
      </Card>

      {/* アカウント連携 */}
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

            {/* Instagram（任意） */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Instagram className="w-8 h-8 text-pink-600" />
                <div>
                  <div className="font-medium">Instagram</div>
                  <div className="text-sm text-gray-600">未連携</div>
                </div>
              </div>
              <Badge variant="secondary">未連携</Badge>
            </div>

            {/* X（任意） */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Twitter className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="font-medium">X (旧Twitter)</div>
                  <div className="text-sm text-gray-600">未連携</div>
                </div>
              </div>
              <Badge variant="secondary">未連携</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* リンク */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            お気に入りリンク
          </CardTitle>
          <CardDescription>最大3件まで、あなたのお気に入りのリンクを追加できます</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.map((link, index) => (
            <div key={link.id} className="space-y-2 p-3 rounded-lg border bg-gray-50">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">リンク {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(link.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="タイトル"
                  value={link.title}
                  onChange={(e) => updateLink(link.id, "title", e.target.value)}
                  className="rounded-lg"
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, "url", e.target.value)}
                  className="rounded-lg"
                />
              </div>
            </div>
          ))}

          {links.length < 3 && (
            <Button variant="outline" onClick={addLink} className="w-full rounded-lg border-dashed">
              <Plus className="w-4 h-4 mr-2" />
              リンクを追加
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <div className="flex justify-center">
        <Button size="lg" className="rounded-full px-8">
          <Save className="w-4 h-4 mr-2" />
          プロフィールを保存
        </Button>
      </div>
    </div>
  )
}
