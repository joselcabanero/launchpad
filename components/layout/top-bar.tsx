'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Moon, Sun, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const PAGE_LABELS: Record<string, string> = {
    dashboard: 'Dashboard',
    programs: 'Programs',
    pipeline: 'Pipeline',
    companies: 'Companies',
    evaluation: 'Evaluation',
    settings: 'Settings',
}

export function TopBar() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    const segments = pathname.split('/').filter(Boolean)

    const crumbs = segments.map((seg, i) => {
        const label = PAGE_LABELS[seg] ?? (seg.length > 12 ? `${seg.slice(0, 8)}…` : seg.charAt(0).toUpperCase() + seg.slice(1))
        const isLast = i === segments.length - 1
        return { label, isLast }
    })

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-5">
            <SidebarTrigger className="-ml-1 text-text-muted hover:text-text-primary transition-colors" />
            <Separator orientation="vertical" className="h-4 bg-border" />

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-[12px] text-text-muted/60 font-medium hidden sm:block">Launchpad</span>
                {crumbs.map((crumb, i) => (
                    <React.Fragment key={i}>
                        <ChevronRight className="w-3 h-3 text-text-muted/40 hidden sm:block shrink-0" />
                        <span className={cn(
                            'text-[13px] font-semibold truncate',
                            crumb.isLast ? 'text-text-primary' : 'text-text-muted'
                        )}>
                            {crumb.label}
                        </span>
                    </React.Fragment>
                ))}
            </nav>

            <div className="flex items-center gap-1.5 shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="h-8 w-8 text-text-muted hover:text-text-primary hover:bg-surface-secondary rounded-md"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    )
}
