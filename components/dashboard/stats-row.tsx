'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Layers, TrendingUp, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
    label: string
    value: number
    prefix?: string
    suffix?: string
    icon: React.ElementType
    iconBg: string
    iconColor: string
    accent: string
}

function StatCard({ label, value, prefix = '', suffix = '', icon: Icon, iconBg, iconColor, accent }: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        let start = 0
        const duration = 500
        const increment = value / (duration / 16)

        const timer = setInterval(() => {
            start += increment
            if (start >= value) {
                setDisplayValue(value)
                clearInterval(timer)
            } else {
                setDisplayValue(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [value])

    return (
        <Card className="bg-surface border-border overflow-hidden group hover:shadow-md transition-all duration-200">
            <CardContent className="p-5 relative">
                <div className={cn('absolute left-0 top-0 bottom-0 w-[3px]', accent)} />
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">{label}</p>
                        <h3 className="text-3xl font-bold tabular-nums text-text-primary leading-none">
                            {prefix}{displayValue}{suffix}
                        </h3>
                    </div>
                    <div className={cn('p-2.5 rounded-lg shrink-0 transition-all duration-200 group-hover:scale-105', iconBg)}>
                        <Icon className={cn('w-5 h-5', iconColor)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function StatsRow({
    totalCompanies,
    activePrograms,
    avgScore,
    openTasks
}: {
    totalCompanies: number
    activePrograms: number
    avgScore: number
    openTasks: number
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Total Companies"
                value={totalCompanies}
                icon={Building2}
                iconBg="bg-accent-primary/10"
                iconColor="text-accent-primary"
                accent="bg-accent-primary"
            />
            <StatCard
                label="Active Programs"
                value={activePrograms}
                icon={Layers}
                iconBg="bg-accent-secondary/10"
                iconColor="text-accent-secondary"
                accent="bg-accent-secondary"
            />
            <StatCard
                label="Average Eval Score"
                value={avgScore}
                suffix=" / 100"
                icon={TrendingUp}
                iconBg="bg-accent-deep/10"
                iconColor="text-accent-deep"
                accent="bg-accent-deep"
            />
            <StatCard
                label="Open Tasks"
                value={openTasks}
                icon={ClipboardList}
                iconBg="bg-accent-danger/10"
                iconColor="text-accent-danger"
                accent="bg-accent-danger"
            />
        </div>
    )
}
