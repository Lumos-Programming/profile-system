"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Calendar, Save } from "lucide-react"

interface FormField {
  id: string
  type: "text" | "textarea" | "select" | "checkbox"
  label: string
  required: boolean
  options?: string[]
}

interface EventCreationFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function EventCreationForm({ isOpen, onClose }: EventCreationFormProps) {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    description: "",
    year: "2024",
    visibility: "public" as "public" | "discord",
    deadline: "",
    deadlineTime: "",
  })

  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: "1",
      type: "text",
      label: "参加理由",
      required: true,
    },
    {
      id: "2",
      type: "textarea",
      label: "意気込み・コメント",
      required: false,
    },
  ])

  const addFormField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: "text",
      label: "",
      required: false,
    }
    setFormFields([...formFields, newField])
  }

  const removeFormField = (id: string) => {
    setFormFields(formFields.filter((field) => field.id !== id))
  }

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const handleSave = () => {
    // イベント保存処理
    console.log("Event data:", eventData)
    console.log("Form fields:", formFields)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            新しいイベントを作成
          </DialogTitle>
          <DialogDescription>イベントの詳細情報と参加フォームを設定してください</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本情報</CardTitle>
              <CardDescription>イベントの基本的な情報を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">イベント名</Label>
                  <Input
                    id="eventName"
                    value={eventData.name}
                    onChange={(e) => setEventData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="例：新歓BBQ大会"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">開催日</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventData.date}
                    onChange={(e) => setEventData((prev) => ({ ...prev, date: e.target.value }))}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDescription">イベント詳細</Label>
                <Textarea
                  id="eventDescription"
                  value={eventData.description}
                  onChange={(e) => setEventData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="イベントの詳細を入力してください..."
                  className="rounded-lg min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventYear">対象年度</Label>
                  <Select
                    value={eventData.year}
                    onValueChange={(value) => setEventData((prev) => ({ ...prev, year: value }))}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024年度</SelectItem>
                      <SelectItem value="2025">2025年度</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">公開範囲</Label>
                  <Select
                    value={eventData.visibility}
                    onValueChange={(value: "public" | "discord") =>
                      setEventData((prev) => ({ ...prev, visibility: value }))
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">全体公開</SelectItem>
                      <SelectItem value="discord">Discord参加者限定</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">募集締切</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={`${eventData.deadline}T${eventData.deadlineTime}`}
                    onChange={(e) => {
                      const [date, time] = e.target.value.split("T")
                      setEventData((prev) => ({ ...prev, deadline: date, deadlineTime: time }))
                    }}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 参加フォーム設定 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">参加フォーム設定</CardTitle>
              <CardDescription>参加者に入力してもらう質問項目を設定してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">質問 {index + 1}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFormField(field.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>質問内容</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                        placeholder="質問を入力してください"
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>入力形式</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value: FormField["type"]) => updateFormField(field.id, { type: value })}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">短文テキスト</SelectItem>
                          <SelectItem value="textarea">長文テキスト</SelectItem>
                          <SelectItem value="select">選択肢</SelectItem>
                          <SelectItem value="checkbox">チェックボックス</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateFormField(field.id, { required: checked })}
                    />
                    <Label className="text-sm">必須項目</Label>
                  </div>

                  {(field.type === "select" || field.type === "checkbox") && (
                    <div className="space-y-2">
                      <Label className="text-sm">選択肢（1行に1つずつ入力）</Label>
                      <Textarea
                        value={field.options?.join("\n") || ""}
                        onChange={(e) =>
                          updateFormField(field.id, { options: e.target.value.split("\n").filter(Boolean) })
                        }
                        placeholder="選択肢1&#10;選択肢2&#10;選択肢3"
                        className="rounded-lg"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              ))}

              <Button variant="outline" onClick={addFormField} className="w-full rounded-lg border-dashed">
                <Plus className="w-4 h-4 mr-2" />
                質問を追加
              </Button>
            </CardContent>
          </Card>

          {/* 保存ボタン */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              イベントを作成
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
