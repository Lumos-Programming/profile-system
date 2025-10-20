"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import ReactMarkdown from "react-markdown"

// プロファイルの型定義
interface Profile {
    学籍番号: string
    ニックネーム: string
    姓: string
    名: string
    学部: string
    自己紹介: string
    LINE: string
    Discord: string
    GitHub: string
    公開設定: {
        学籍番号: boolean
        ニックネーム: boolean
        姓: boolean
        名: boolean
        学部: boolean
        自己紹介: boolean
        LINE: boolean
        Discord: boolean
        GitHub: boolean
    }
}

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(true)
    const [profile, setProfile] = useState<Profile>({
        学籍番号: "2024001",
        ニックネーム: "たろう",
        姓: "山田",
        名: "太郎",
        学部: "理工学部",
        自己紹介: "**プログラミング**が好きです。特にWeb開発に興味があります。",
        LINE: "@yamada_line",
        Discord: "yamada#1234",
        GitHub: "github.com/yamada",
        公開設定: {
            学籍番号: true,
            ニックネーム: true,
            姓: true,
            名: true,
            学部: true,
            自己紹介: true,
            LINE: false,
            Discord: false,
            GitHub: true,
        },
    })

    const faculties = ["理工学部", "都市科学部", "経済学部", "経営学部", "教育学部"]

    const handleSave = () => {
        // TODO: APIを呼び出してプロフィールを保存
        setIsEditing(false)
    }

    const handlePublish = async () => {
        const payload = {
            student_id: profile.学籍番号,
            faculty: profile.学部,
            last_name: profile.姓,
            first_name: profile.名,
            nickname: profile.ニックネーム,
            self_introduction: profile.自己紹介,
            visibility: {
                name: profile.公開設定.姓 && profile.公開設定.名,
                self_introduction: profile.公開設定.自己紹介,
                x: profile.公開設定.LINE,
                instagram: profile.公開設定.Discord,
            },
        }

        try {
            const response = await fetch("http://localhost:8080/api/profile/basic-info", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                alert("プロフィールが公開されました！")
            } else {
                alert("公開に失敗しました。もう一度お試しください。")
            }
        } catch (error) {
            console.error("エラーが発生しました: ", error)
            alert("エラーが発生しました。もう一度お試しください。")
        }
    }

    return (
        <div className="min-h-screen bg-purple-50 dark:bg-gradient-to-br dark:from-black dark:to-purple-900">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* <header>
                    <h1 className="text-2xl font-bold">Lumos Profile System</h1>
                </header>
                <h1 className="text-4xl font-bold mb-6 text-center">Lumos Profile System</h1> */}

                {/* スライドトグル */}
                <div className="flex justify-center mb-6">
                    <div className="flex bg-gray-200 rounded-full p-1">
                        <button
                            onClick={() => setIsEditing(true)}
                            className={`px-4 py-2 rounded-full ${isEditing ? "bg-purple-600 text-white" : "text-gray-700"}`}
                        >
                            編集モード
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className={`px-4 py-2 rounded-full ${!isEditing ? "bg-purple-600 text-white" : "text-gray-700"}`}
                        >
                            プレビューモード
                        </button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-semibold">
                                {isEditing ? "編集モード" : "プレビューモード"}
                            </div>
                            {isEditing && (
                                <Button onClick={handlePublish} variant="default">
                                    公開
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.keys(profile)
                                    .filter((key) => key !== "公開設定")
                                    .map((key) => (
                                        <div
                                            key={key}
                                            className={key === "自己紹介" ? "md:col-span-2 space-y-2" : "space-y-2"}
                                        >
                                            <div className="flex items-center justify-between">
                                                <Label>{key}</Label>
                                                {key === "自己紹介" && isEditing && (
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            type="button"
                                                            title="太字を挿入"
                                                            className="px-2 py-1 rounded bg-purple-800 text-white text-sm"
                                                            onClick={() => setProfile({ ...profile, 自己紹介: profile.自己紹介 + " **太字**" })}
                                                        >
                                                            B
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="斜体を挿入"
                                                            className="px-2 py-1 rounded bg-purple-800 text-white text-sm"
                                                            onClick={() => setProfile({ ...profile, 自己紹介: profile.自己紹介 + " *斜体*" })}
                                                        >
                                                            I
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="リンク挿入"
                                                            className="px-2 py-1 rounded bg-purple-800 text-white text-sm"
                                                            onClick={() => setProfile({ ...profile, 自己紹介: profile.自己紹介 + " [リンク名](https://example.com)" })}
                                                        >
                                                            🔗
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="インラインコードを挿入"
                                                            className="px-2 py-1 rounded bg-purple-800 text-white text-sm font-mono"
                                                            onClick={() => setProfile({ ...profile, 自己紹介: profile.自己紹介 + " `コード`" })}
                                                        >
                                                            {'</>'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="見出しを挿入"
                                                            className="px-2 py-1 rounded bg-purple-800 text-white text-sm"
                                                            onClick={() => setProfile({ ...profile, 自己紹介: profile.自己紹介 + "\n\n## 見出し" })}
                                                        >
                                                            H
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {key === "自己紹介" ? (
                                                <Textarea
                                                    value={profile[key as keyof Profile] as string}
                                                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                                    rows={6}
                                                    className="mt-1"
                                                    placeholder="自己紹介を入力してください"
                                                />
                                            ) : key === "学部" ? (
                                                <select
                                                    value={profile[key as keyof Profile] as string}
                                                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-700 focus:border-purple-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                                >
                                                    {faculties.map((faculty) => (
                                                        <option key={faculty} value={faculty}>
                                                            {faculty}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <Input
                                                    value={profile[key as keyof Profile] as string}
                                                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                                    placeholder={`${key}を入力してください`}
                                                />
                                            )}

                                            <div className="flex items-center space-x-2">
                                                <Label>公開</Label>
                                                <Switch
                                                    checked={profile.公開設定[key as keyof Profile["公開設定"]]}
                                                    onCheckedChange={(checked) =>
                                                        setProfile({
                                                            ...profile,
                                                            公開設定: {
                                                                ...profile.公開設定,
                                                                [key]: checked,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.keys(profile)
                                    .filter((key) => key !== "公開設定")
                                    .map((key) => (
                                        profile.公開設定[key as keyof Profile["公開設定"]] || isEditing ? (
                                            key === "名" && !isEditing ? null : (
                                                <div
                                                    key={key}
                                                    className={key === "自己紹介" ? "md:col-span-2 space-y-2" : "space-y-2"}
                                                >
                                                    <Label>{!isEditing && key === "姓" ? "氏名" : key}</Label>
                                                    {key === "自己紹介" ? (
                                                        <ReactMarkdown>{profile[key as keyof Profile] as string}</ReactMarkdown>
                                                    ) : !isEditing && key === "姓" ? (
                                                        <p className="text-sm mt-1 whitespace-nowrap">
                                                            {profile.姓} {profile.名}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm mt-1">{profile[key as keyof Profile] as string}</p>
                                                    )}
                                                </div>
                                            )
                                        ) : null
                                    ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* Footer removed from here; site-wide footer is rendered in layout */}
            </div>
        </div>
    )
}
