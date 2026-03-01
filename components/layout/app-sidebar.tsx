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
    User2,
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
    SidebarGroupLabel,
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
        <Sidebar collapsible="icon" className="bg-sidebar-bg border-r border-border font-inter">
            <SidebarHeader className="flex items-center px-4 py-6">
                <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                    <span className="text-2xl font-semibold text-sidebar-active tracking-tight">Launchpad</span>
                </Link>
                <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
                    <span className="text-xl font-bold text-sidebar-active">L</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = pathname.startsWith(item.href)
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            className={cn(
                                                'transition-all duration-200 h-10',
                                                isActive
                                                    ? 'bg-sidebar-hover text-sidebar-text border-l-2 border-sidebar-active'
                                                    : 'text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text'
                                            )}
                                        >
                                            <Link href={item.href} className="flex items-center gap-3">
                                                <item.icon className={cn('w-5 h-5', isActive ? 'text-sidebar-active' : 'text-sidebar-text-muted')} />
                                                <span className="text-[13px] font-medium">{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-[#2A2A2A]">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Settings" className="text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text h-10">
                            <Link href="/settings" className="flex items-center gap-3">
                                <Settings className="w-5 h-5" />
                                <span className="text-[13px] font-medium">Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-12 mt-2 group-data-[collapsible=icon]:p-0">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.photoURL || undefined} />
                                        <AvatarFallback className="bg-sidebar-hover text-sidebar-text text-[10px]">
                                            {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col ml-3 text-left group-data-[collapsible=icon]:hidden overflow-hidden">
                                        <span className="text-[12px] font-medium text-sidebar-text truncate">
                                            {user?.displayName || user?.email?.split('@')[0]}
                                        </span>
                                        <span className="text-[10px] text-sidebar-text-muted truncate">
                                            {user?.email}
                                        </span>
                                    </div>
                                    <ChevronUp className="ml-auto w-4 h-4 text-sidebar-text-muted group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] bg-sidebar-bg border-border text-sidebar-text"
                            >
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/10 cursor-pointer">
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
