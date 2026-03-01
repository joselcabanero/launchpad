'use client'

import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { DealStage, Company, CompanyAvgScore } from '@/types'
import { CompanyCard } from './company-card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
    stage: DealStage
    companies: Company[]
    scores: CompanyAvgScore[]
}

export function KanbanColumn({ stage, companies, scores }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: stage.code
    })

    return (
        <div className="flex flex-col w-[280px] min-w-[280px] shrink-0 bg-surface/40 rounded-lg p-3 min-h-[600px] border border-border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wider">{stage.title}</h3>
                <Badge className="bg-accent-primary text-text-inverse h-5 w-5 rounded-full flex items-center justify-center p-0 text-[10px]">
                    {companies.length}
                </Badge>
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    'flex-1 transition-colors rounded-md',
                    isOver && 'bg-accent-primary/5 border-2 border-dashed border-accent-primary/20'
                )}
            >
                {companies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg bg-surface/20">
                        <span className="text-[10px] text-text-muted/40 uppercase font-medium">No startups here</span>
                    </div>
                ) : (
                    companies.map(company => (
                        <CompanyCard
                            key={company.id}
                            company={company}
                            score={scores.find(s => s.company_id === company.id)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
