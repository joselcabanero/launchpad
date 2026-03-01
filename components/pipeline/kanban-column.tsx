'use client'

import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { DealStage, Company, CompanyAvgScore } from '@/types'
import { CompanyCard } from './company-card'
import { cn } from '@/lib/utils'

// Stage-specific color config
const STAGE_STYLES: Record<string, { dot: string; count: string; header: string }> = {
    applied:      { dot: 'bg-blue-400',         count: 'bg-blue-100 text-blue-700',       header: 'text-blue-600' },
    under_review: { dot: 'bg-amber-400',         count: 'bg-amber-100 text-amber-700',     header: 'text-amber-600' },
    shortlisted:  { dot: 'bg-accent-primary',    count: 'bg-accent-primary/10 text-accent-primary', header: 'text-accent-primary' },
    interview:    { dot: 'bg-purple-400',        count: 'bg-purple-100 text-purple-700',   header: 'text-purple-600' },
    selected:     { dot: 'bg-emerald-400',       count: 'bg-emerald-100 text-emerald-700', header: 'text-emerald-600' },
    rejected:     { dot: 'bg-accent-danger',     count: 'bg-accent-danger/10 text-accent-danger',   header: 'text-accent-danger' },
}

interface KanbanColumnProps {
    stage: DealStage
    companies: Company[]
    scores: CompanyAvgScore[]
}

export function KanbanColumn({ stage, companies, scores }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: stage.code })
    const style = STAGE_STYLES[stage.code] ?? STAGE_STYLES['applied']

    return (
        <div className="flex flex-col w-[272px] min-w-[272px] shrink-0 rounded-lg min-h-[580px]">
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full shrink-0', style.dot)} />
                    <h3 className={cn('text-[12px] font-bold uppercase tracking-wider', style.header)}>
                        {stage.title}
                    </h3>
                </div>
                <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums', style.count)}>
                    {companies.length}
                </span>
            </div>

            {/* Drop zone */}
            <div
                ref={setNodeRef}
                className={cn(
                    'flex-1 rounded-lg p-2 transition-all duration-150',
                    'bg-surface/50 border border-border/60',
                    isOver && 'bg-accent-primary/5 border-accent-primary/30 border-dashed'
                )}
            >
                {companies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-28 rounded-md border-2 border-dashed border-border/40">
                        <span className="text-[10px] text-text-muted/30 uppercase font-semibold tracking-wider">Drop here</span>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {companies.map(company => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                score={scores.find(s => s.company_id === company.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
