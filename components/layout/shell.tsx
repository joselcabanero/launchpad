'use client'

import React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { AuthGuard } from '@/components/layout/auth-guard'
import { usePathname } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'

export function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/login'

    if (isLoginPage) {
        return (
            <AuthGuard>
                {children}
                <Toaster position="bottom-right" />
            </AuthGuard>
        )
    }

    return (
        <AuthGuard>
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-background font-inter selection:bg-accent-primary/20 selection:text-accent-primary">
                    <AppSidebar />
                    <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
                        <TopBar />
                        <main className="flex-1 overflow-auto p-6 md:p-8 2xl:p-10">
                            {children}
                        </main>
                    </SidebarInset>
                </div>
                <Toaster position="bottom-right" />
            </SidebarProvider>
        </AuthGuard>
    )
}
