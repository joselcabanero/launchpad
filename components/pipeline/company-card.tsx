'use client'

import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Company, CompanyAvgScore } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                'cursor-grab active:cursor-grabbing mb-3 group',
                isDragging && 'opacity-50 cursor-grabbing'
            )}
        >
            <Card className="bg-white border-border hover:border-accent-primary transition-all shadow-sm group-hover:shadow-md">
                <CardContent className="p-4 space-y-3">
                    <div className="flex flex-col">
                        <h4 className="text-[14px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors truncate">
                            {company.trade_name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="outline" className="bg-surface-secondary text-text-primary text-[10px] px-1.5 py-0 font-normal uppercase tracking-wider">
                                {company.sector}
                            </Badge>
                            <span className="text-[10px] text-text-muted">{company.business_stage}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        {score ? (
                            <div className="flex flex-col">
                                <span className="text-[9px] text-text-muted uppercase">Score</span>
                                <span className={cn(
                                    'text-[13px] font-bold tabular-nums',
                                    score.avg_score >= 70 ? 'text-accent-primary' :
                                        score.avg_score >= 50 ? 'text-accent-secondary' : 'text-accent-danger'
                                )}>
                                    {score.avg_score}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <span className="text-[9px] text-text-muted uppercase">Score</span>
                                <span className="text-[13px] font-bold text-text-muted/40">—</span>
                            </div>
                        )}
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] text-text-muted uppercase">Applied</span>
                            <span className="text-[10px] text-text-muted font-medium">
                                {formatDistanceToNow(company.createdDate.toDate())} ago
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
