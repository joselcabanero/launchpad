'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Layers, LineChart, ClipboardList } from 'lucide-react'

interface StatCardProps {
    label: string
    value: number
    prefix?: string
    suffix?: string
    icon: React.ElementType
}

function StatCard({ label, value, prefix = '', suffix = '', icon: Icon }: StatCardProps) {
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
        <Card className="bg-surface border-border overflow-hidden group">
            <CardContent className="p-6 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-primary" />
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[12px] font-medium text-text-muted uppercase tracking-wider">{label}</p>
                        <h3 className="text-3xl font-bold tabular-nums text-text-primary">
                            {prefix}{displayValue}{suffix}
                        </h3>
                    </div>
                    <div className="p-3 bg-accent-primary/10 rounded-lg group-hover:bg-accent-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-accent-primary" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Companies" value={totalCompanies} icon={Building2} />
            <StatCard label="Active Programs" value={activePrograms} icon={Layers} />
            <StatCard label="Average Eval Score" value={avgScore} suffix=" / 100" icon={LineChart} />
            <StatCard label="Open Tasks" value={openTasks} icon={ClipboardList} />
        </div>
    )
}
