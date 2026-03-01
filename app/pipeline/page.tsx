'use client'

import React, { useState, useEffect } from 'react'
import { usePrograms } from '@/hooks/use-programs'
import { useQuery } from '@tanstack/react-query'
import { fetchCohorts, fetchCompanyAvgScores } from '@/lib/firestore'
import { usePipeline } from '@/hooks/use-pipeline'
import { KanbanBoard } from '@/components/pipeline/kanban-board'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

export default function PipelinePage() {
    const { data: programs, isLoading: programsLoading } = usePrograms()
    const [selectedProgramId, setSelectedProgramId] = useState<string>('')
    const [selectedCohortId, setSelectedCohortId] = useState<string>('')

    const { data: cohorts, isLoading: cohortsLoading } = useQuery({
        queryKey: ['cohorts_pipeline', selectedProgramId],
        queryFn: () => fetchCohorts(selectedProgramId),
        enabled: true,
    })

    // Set initial selected values when data loads
    useEffect(() => {
        if (programs?.length && !selectedProgramId) {
            setTimeout(() => setSelectedProgramId(programs[0].id), 0)
        }
    }, [programs, selectedProgramId])

    useEffect(() => {
        if (cohorts?.length && !selectedCohortId) {
            setTimeout(() => setSelectedCohortId(cohorts[0].id), 0)
        }
    }, [cohorts, selectedCohortId])

    // Get scores for the Kanban cards
    const { data: scores } = useQuery({
        queryKey: ['company_avg_scores_pipeline', selectedCohortId],
        queryFn: () => fetchCompanyAvgScores(selectedCohortId, 2),
        enabled: !!selectedCohortId,
    })

    // Real-time hook for companies and stages
    const { stages, companies, loading: pipelineLoading } = usePipeline(selectedCohortId)

    const isLoading = programsLoading || cohortsLoading || (pipelineLoading && !!selectedCohortId)

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-[200px] bg-surface" />
                    <Skeleton className="h-10 w-[200px] bg-surface" />
                </div>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-[600px] w-[280px] bg-surface" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 font-inter h-full flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Deal Pipeline</h1>
                    <p className="text-sm text-text-muted mt-1">Manage and track company progress through stages.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                        <SelectTrigger className="w-[200px] bg-surface border-border">
                            <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                            {programs?.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedCohortId} onValueChange={setSelectedCohortId}>
                        <SelectTrigger className="w-[200px] bg-surface border-border">
                            <SelectValue placeholder="Select Cohort" />
                        </SelectTrigger>
                        <SelectContent>
                            {cohorts?.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard stages={stages} companies={companies} scores={scores || []} />
            </div>
        </div>
    )
}
