'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

/**
 * AuthGuard - Bypassed for development/preview.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { user, loading } = useAuth()

    // Simplified: Always show children for now to allow preview without credentials
    return <>{children}</>
}
