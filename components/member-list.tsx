"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, MessageSquare, Github, Instagram, Twitter, ExternalLink } from "lucide-react"

interface Member {
  id: string
  name: string
  nickname: string
  department: string
  bio: string
  roles: string[]
  accounts: {
    discord?: string
    github?: string
    instagram?: string
    twitter?: string
  }
  links: Array<{ title: string; url: string }>
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "田中 太郎",
    nickname: "たなたろ",
    department: "情報工学部",
    bio: "プログラミングが好きな2年生です！Webアプリ開発に興味があります。",
    roles: ["2年生", "Web班", "副代表"],
    accounts: {
      discord: "tanaka#1234",
      github: "tanaka-dev",
    },
    links: [
      { title: "個人ブログ", url: "https://tanaka-blog.com" },
      { title: "ポートフォリオ", url: "https://tanaka-portfolio.dev" },
    ],
  },
  {
    id: "2",
    name: "佐藤 花子",
    nickname: "さとはな",
    department: "経済学部",
    bio: "イベント企画が得意です！みんなで楽しいことをしましょう🎉",
    roles: ["3年生", "イベント班", "代表"],
    accounts: {
      discord: "hanako#5678",
      instagram: "sato_hanako",
    },
    links: [{ title: "Instagram", url: "https://instagram.com/sato_hanako" }],
  },
  {
    id: "3",
    name: "山田 次郎",
    nickname: "やまじ",
    department: "理学部",
    bio: "数学とプログラミングの融合に興味があります。競技プログラミングもやってます！",
    roles: ["1年生", "Web班"],
    accounts: {
      discord: "yamaji#9999",
      github: "yamada-jiro",
      twitter: "yamaji_math",
    },
    links: [
      { title: "AtCoder", url: "https://atcoder.jp/users/yamaji" },
      { title: "数学ブログ", url: "https://yamaji-math.blog" },
    ],
  },
]

export default function MemberList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  const allRoles = Array.from(new Set(mockMembers.flatMap((member) => member.roles)))
  const allDepartments = Array.from(new Set(mockMembers.map((member) => member.department)))

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.includes(searchTerm) || member.nickname.includes(searchTerm) || member.bio.includes(searchTerm)
    const matchesRole = selectedRole === "all" || member.roles.includes(selectedRole)
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment

    return matchesSearch && matchesRole && matchesDepartment
  })

  return (
    <div className="space-y-6">
      {/* 検索・フィルター */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-indigo-600" />
            メンバー検索
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="名前、ニックネーム、自己紹介で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ロール</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {allRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">学部</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {allDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メンバー一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">{member.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">@{member.nickname}</p>
                  <p className="text-sm text-gray-500">{member.department}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* ロール */}
              <div className="flex flex-wrap gap-1">
                {member.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>

              {/* 自己紹介 */}
              <p className="text-sm text-gray-700 line-clamp-3">{member.bio}</p>

              {/* アカウント連携 */}
              <div className="flex items-center gap-2 flex-wrap">
                {member.accounts.discord && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-indigo-50 px-2 py-1 rounded-full">
                    <MessageSquare className="w-3 h-3" />
                    {member.accounts.discord}
                  </div>
                )}
                {member.accounts.github && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                    <Github className="w-3 h-3" />
                    {member.accounts.github}
                  </div>
                )}
                {member.accounts.instagram && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-pink-50 px-2 py-1 rounded-full">
                    <Instagram className="w-3 h-3" />
                    {member.accounts.instagram}
                  </div>
                )}
                {member.accounts.twitter && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-full">
                    <Twitter className="w-3 h-3" />
                    {member.accounts.twitter}
                  </div>
                )}
              </div>

              {/* リンク */}
              {member.links.length > 0 && (
                <div className="space-y-1">
                  {member.links.map((link, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-auto p-2 justify-start text-left w-full"
                      asChild
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate text-xs">{link.title}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">メンバーが見つかりません</h3>
            <p className="text-gray-500">検索条件を変更してみてください</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
