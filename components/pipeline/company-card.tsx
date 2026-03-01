'use client'

import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Company, CompanyAvgScore } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { MapPin, GripVertical } from 'lucide-react'

interface CompanyCardProps {
    company: Company
    score?: CompanyAvgScore
}

export function CompanyCard({ company, score }: CompanyCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: company.id,
        data: company
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
    } : undefined

    const scoreColor = score
        ? score.avg_score >= 70 ? 'text-accent-primary'
            : score.avg_score >= 50 ? 'text-accent-secondary'
                : 'text-accent-danger'
        : 'text-text-muted/30'

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                'cursor-grab active:cursor-grabbing group select-none',
                isDragging && 'opacity-40'
            )}
        >
            <div className="bg-background border border-border rounded-md p-3.5 shadow-sm hover:shadow-md hover:border-accent-primary/30 transition-all duration-150 group-hover:translate-y-[-1px]">
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors truncate leading-tight">
                            {company.trade_name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-2.5 h-2.5 text-text-muted/50 shrink-0" />
                            <span className="text-[10px] text-text-muted/60 truncate">{company.city || 'Unknown'}</span>
                        </div>
                    </div>
                    <GripVertical className="w-3.5 h-3.5 text-text-muted/20 group-hover:text-text-muted/50 transition-colors shrink-0 mt-0.5" />
                </div>

                {/* Badges row */}
                <div className="flex items-center gap-1.5 mt-2.5">
                    <Badge variant="outline" className="bg-surface text-text-muted/80 text-[9px] px-1.5 py-0 font-semibold uppercase tracking-wider border-border/60">
                        {company.sector}
                    </Badge>
                    <span className="text-[9px] text-text-muted/50 font-medium">{company.business_stage}</span>
                </div>

                {/* Score + time row */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/50">
                    <div>
                        <p className="text-[8px] text-text-muted/50 uppercase font-bold tracking-wider">Score</p>
                        <span className={cn('text-[14px] font-bold tabular-nums leading-none', scoreColor)}>
                            {score ? score.avg_score : '—'}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] text-text-muted/50 uppercase font-bold tracking-wider">Applied</p>
                        <span className="text-[10px] text-text-muted/70 font-medium">
                            {formatDistanceToNow(company.createdDate.toDate(), { addSuffix: true })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
