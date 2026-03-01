'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Layers,
    Kanban,
    Building2,
    ClipboardCheck,
    Settings,
    LogOut,
    ChevronUp,
    Rocket,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupContent,
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Programs', icon: Layers, href: '/programs' },
    { label: 'Pipeline', icon: Kanban, href: '/pipeline' },
    { label: 'Companies', icon: Building2, href: '/companies' },
    { label: 'Evaluation', icon: ClipboardCheck, href: '/evaluation' },
]

export function AppSidebar() {
    const pathname = usePathname()
    const user = auth.currentUser

    const handleLogout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <Sidebar collapsible="icon" className="border-r-0 font-inter" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
            {/* Header / Logo */}
            <SidebarHeader className="px-4 py-5 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden">
                    <div className="w-7 h-7 rounded-md bg-accent-primary flex items-center justify-center shrink-0">
                        <Rocket className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[15px] font-bold text-sidebar-text tracking-tight">Launchpad</span>
                        <span className="text-[9px] text-sidebar-text-muted uppercase tracking-widest font-semibold">Accelerator OS</span>
                    </div>
                </Link>
                <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
                    <div className="w-7 h-7 rounded-md bg-accent-primary flex items-center justify-center">
                        <Rocket className="w-3.5 h-3.5 text-white" />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="pt-3">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href)
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            className={cn(
                                                'mx-2 rounded-md h-9 transition-all duration-150',
                                                isActive
                                                    ? 'bg-accent-primary/15 text-sidebar-text'
                                                    : 'text-sidebar-text-muted hover:bg-white/5 hover:text-sidebar-text'
                                            )}
                                        >
                                            <Link href={item.href} className="flex items-center gap-3 px-2">
                                                <item.icon className={cn(
                                                    'w-4 h-4 shrink-0',
                                                    isActive ? 'text-accent-primary' : 'text-sidebar-text-muted'
                                                )} />
                                                <span className={cn(
                                                    'text-[13px] font-medium',
                                                    isActive ? 'text-sidebar-text' : ''
                                                )}>
                                                    {item.label}
                                                </span>
                                                {isActive && (
                                                    <div className="ml-auto w-1 h-4 rounded-full bg-accent-primary shrink-0 group-data-[collapsible=icon]:hidden" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-3 border-t border-white/5">
                <SidebarMenu className="gap-0.5">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Settings"
                            className="mx-0 rounded-md h-9 text-sidebar-text-muted hover:bg-white/5 hover:text-sidebar-text transition-all"
                        >
                            <Link href="/settings" className="flex items-center gap-3 px-2">
                                <Settings className="w-4 h-4 shrink-0" />
                                <span className="text-[13px] font-medium">Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-11 mt-1 rounded-md px-2 hover:bg-white/5 transition-all group-data-[collapsible=icon]:justify-center">
                                    <Avatar className="h-7 w-7 shrink-0">
                                        <AvatarImage src={user?.photoURL || undefined} />
                                        <AvatarFallback className="bg-accent-primary/20 text-accent-primary text-[10px] font-bold">
                                            {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col ml-2 text-left group-data-[collapsible=icon]:hidden overflow-hidden min-w-0">
                                        <span className="text-[12px] font-semibold text-sidebar-text truncate">
                                            {user?.displayName || user?.email?.split('@')[0]}
                                        </span>
                                        <span className="text-[10px] text-sidebar-text-muted truncate">
                                            {user?.email}
                                        </span>
                                    </div>
                                    <ChevronUp className="ml-auto w-3.5 h-3.5 text-sidebar-text-muted group-data-[collapsible=icon]:hidden shrink-0" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] bg-sidebar-bg border-white/10 text-sidebar-text"
                            >
                                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer focus:text-red-400 focus:bg-red-500/10">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
