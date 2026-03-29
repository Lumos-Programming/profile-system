"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import ReactMarkdown from "react-markdown"
import { DefaultApi, Configuration } from "@/src/lib/api"

const apiClient = new DefaultApi(new Configuration({ basePath: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080" }))

interface Profile {
    studentId: string
    nickname: string
    lastName: string
    firstName: string
    faculty: string
    selfIntroduction: string
    visibility: {
        name: boolean
        selfIntroduction: boolean
        x: boolean
        instagram: boolean
    }
}

const defaultProfile: Profile = {
    studentId: "",
    nickname: "",
    lastName: "",
    firstName: "",
    faculty: "",
    selfIntroduction: "",
    visibility: {
        name: false,
        selfIntroduction: false,
        x: false,
        instagram: false,
    },
}

// 表示ラベルのマップ
const fieldLabels: Record<keyof Omit<Profile, "visibility">, string> = {
    studentId: "学籍番号",
    nickname: "ニックネーム",
    lastName: "姓",
    firstName: "名",
    faculty: "学部",
    selfIntroduction: "自己紹介",
}

const faculties = ["理工学部", "都市科学部", "経済学部", "経営学部", "教育学部"]

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(true)
    const [profile, setProfile] = useState<Profile>(defaultProfile)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await apiClient.apiProfileBasicInfoGet()
                const data = response.data
                setProfile({
                    studentId: data.student_id,
                    nickname: data.nickname,
                    lastName: data.last_name,
                    firstName: data.first_name,
                    faculty: data.faculty,
                    selfIntroduction: data.self_introduction,
                    visibility: {
                        name: data.visibility.name,
                        selfIntroduction: data.visibility.self_introduction,
                        x: data.visibility.x,
                        instagram: data.visibility.instagram,
                    },
                })
            } catch (err) {
                console.error("プロフィールの取得に失敗しました: ", err)
                setError("プロフィールの取得に失敗しました。バックエンドが起動しているか確認してください。")
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handlePublish = async () => {
        const payload = {
            student_id: profile.studentId,
            faculty: profile.faculty,
            last_name: profile.lastName,
            first_name: profile.firstName,
            nickname: profile.nickname,
            self_introduction: profile.selfIntroduction,
            visibility: {
                name: profile.visibility.name,
                self_introduction: profile.visibility.selfIntroduction,
                x: profile.visibility.x,
                instagram: profile.visibility.instagram,
            },
        }

        try {
            const response = await apiClient.apiProfileBasicInfoPut(payload)
            if (response.status === 200) {
                alert("プロフィールが公開されました！")
            } else {
                alert("公開に失敗しました。もう一度お試しください。")
            }
        } catch (err) {
            console.error("エラーが発生しました: ", err)
            alert("エラーが発生しました。もう一度お試しください。")
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-purple-50 dark:bg-gradient-to-br dark:from-black dark:to-purple-900 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-300">読み込み中...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-purple-50 dark:bg-gradient-to-br dark:from-black dark:to-purple-900 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    const editFields = Object.keys(fieldLabels) as (keyof Omit<Profile, "visibility">)[]

    // フィールドに紐づく visibility キー（存在する項目のみ）
    const visibilityKeyMap: Partial<Record<keyof Omit<Profile, "visibility">, keyof Profile["visibility"]>> = {
        lastName: "name",
        selfIntroduction: "selfIntroduction",
    }

    return (
        <div className="min-h-screen bg-purple-50 dark:bg-gradient-to-br dark:from-black dark:to-purple-900">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
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
                                {editFields.map((key) => (
                                    <div
                                        key={key}
                                        className={key === "selfIntroduction" ? "md:col-span-2 space-y-2" : "space-y-2"}
                                    >
                                        <div className="flex items-center justify-between">
                                            <Label>{fieldLabels[key]}</Label>
                                            {key === "selfIntroduction" && (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        title="太字を挿入"
                                                        className="px-2 py-1 rounded bg-purple-800 text-white text-sm"
                                                        onClick={() => setProfile({ ...profile, selfIntroduction: profile.selfIntroduction + " **太字**" })}
                                                    >
                                                        B
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="斜体を挿入"
                                                        className="px-2 py-1 rounded bg-purple-800 text-white text-sm"
                                                        onClick={() => setProfile({ ...profile, selfIntroduction: profile.selfIntroduction + " *斜体*" })}
                                                    >
                                                        I
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="リンク挿入"
                                                        className="px-2 py-1 rounded bg-purple-800 text-white text-sm"
                                                        onClick={() => setProfile({ ...profile, selfIntroduction: profile.selfIntroduction + " [リンク名](https://example.com)" })}
                                                    >
                                                        🔗
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="インラインコードを挿入"
                                                        className="px-2 py-1 rounded bg-purple-800 text-white text-sm font-mono"
                                                        onClick={() => setProfile({ ...profile, selfIntroduction: profile.selfIntroduction + " `コード`" })}
                                                    >
                                                        {'</>'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="見出しを挿入"
                                                        className="px-2 py-1 rounded bg-purple-800 text-white text-sm"
                                                        onClick={() => setProfile({ ...profile, selfIntroduction: profile.selfIntroduction + "\n\n## 見出し" })}
                                                    >
                                                        H
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {key === "selfIntroduction" ? (
                                            <Textarea
                                                value={profile[key]}
                                                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                                rows={6}
                                                className="mt-1"
                                                placeholder="自己紹介を入力してください"
                                            />
                                        ) : key === "faculty" ? (
                                            <select
                                                value={profile[key]}
                                                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-700 focus:border-purple-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                            >
                                                {faculties.map((f) => (
                                                    <option key={f} value={f}>{f}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <Input
                                                value={profile[key]}
                                                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                                placeholder={`${fieldLabels[key]}を入力してください`}
                                            />
                                        )}

                                        {visibilityKeyMap[key] !== undefined && (
                                            <div className="flex items-center space-x-2">
                                                <Label>公開</Label>
                                                <Switch
                                                    checked={profile.visibility[visibilityKeyMap[key]!]}
                                                    onCheckedChange={(checked) =>
                                                        setProfile({
                                                            ...profile,
                                                            visibility: {
                                                                ...profile.visibility,
                                                                [visibilityKeyMap[key]!]: checked,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* SNS 公開設定 */}
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-base font-semibold">SNS 公開設定</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(["x", "instagram"] as const).map((sns) => (
                                            <div key={sns} className="flex items-center space-x-2">
                                                <Label>{sns === "x" ? "X" : "Instagram"}</Label>
                                                <Switch
                                                    checked={profile.visibility[sns]}
                                                    onCheckedChange={(checked) =>
                                                        setProfile({
                                                            ...profile,
                                                            visibility: { ...profile.visibility, [sns]: checked },
                                                        })
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {editFields.map((key) => {
                                    const visKey = visibilityKeyMap[key]
                                    const isVisible = visKey !== undefined ? profile.visibility[visKey] : true
                                    if (!isVisible && key !== "studentId" && key !== "nickname" && key !== "faculty") return null
                                    if (key === "firstName") return null

                                    return (
                                        <div
                                            key={key}
                                            className={key === "selfIntroduction" ? "md:col-span-2 space-y-2" : "space-y-2"}
                                        >
                                            <Label>{key === "lastName" ? "氏名" : fieldLabels[key]}</Label>
                                            {key === "selfIntroduction" ? (
                                                <ReactMarkdown>{profile[key]}</ReactMarkdown>
                                            ) : key === "lastName" ? (
                                                <p className="text-sm mt-1 whitespace-nowrap">
                                                    {profile.lastName} {profile.firstName}
                                                </p>
                                            ) : (
                                                <p className="text-sm mt-1">{profile[key]}</p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
