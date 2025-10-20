"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, User } from "lucide-react"
import { useEffect, useState } from "react"

const navItems = [
    {
        name: "プロフィール編集",
        href: "/profile",
        icon: User,
    },
    {
        name: "メンバー一覧",
        href: "/members",
        icon: Users,
    },
]

export function Header() {
    const pathname = usePathname()
    const [isDark, setIsDark] = useState(true)

    // Initialize theme from localStorage or default to dark
    useEffect(() => {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('site-theme') : null
        const dark = stored ? stored === 'dark' : true
        setIsDark(dark)
        if (typeof document !== 'undefined') {
            if (dark) document.documentElement.classList.add('dark')
            else document.documentElement.classList.remove('dark')
        }
    }, [])

    const toggleTheme = () => {
        const next = !isDark
        setIsDark(next)
        if (typeof document !== 'undefined') {
            if (next) document.documentElement.classList.add('dark')
            else document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('site-theme', next ? 'dark' : 'light')
    }

    return (
        <header className="bg-white shadow-sm border-b dark:bg-gray-900 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="flex items-baseline gap-2">
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); toggleTheme() }}
                                className="text-xl font-bold text-purple-600 hover:text-purple-400 transition-colors focus:outline-none"
                                title={isDark ? '明るくする (Lumos → Nox)' : '暗くする (Nox → Lumos)'}
                            >
                                {isDark ? 'Lumos' : 'Nox'}
                            </button>
                            <span className="text-lg font-semibold ml-1 text-gray-800 dark:text-gray-100">Profile System</span>
                        </Link>
                    </div>
                    <nav className="flex items-center space-x-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        size="sm"
                                        className={cn(
                                            "flex items-center space-x-2",
                                            isActive && "bg-purple-800 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:inline">{item.name}</span>
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>
        </header>
    )
}
