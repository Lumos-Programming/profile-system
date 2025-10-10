"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-800">Lumosアカウント管理システム</h1>
                <nav className="flex items-center gap-2">
                    <Link href="/setting">
                        <Button variant={"ghost"} className="rounded-full">
                            設定
                        </Button>
                    </Link>
                    <Link href="/members">
                        <Button variant={"ghost"} className="rounded-full">
                            メンバー一覧
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
