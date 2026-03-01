'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export function TopBar() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const { isMobile, toggleSidebar } = useSidebar()

    // Basic breadcrumb
    const segments = pathname.split('/').filter(Boolean)
    const title = segments.length > 0
        ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
        : 'Overview'

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
            <div className="flex flex-1 items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h2 className="text-lg font-semibold text-text-primary tracking-tight font-inter">
                    {title}
                </h2>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-text-muted hover:text-text-primary"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    )
}
