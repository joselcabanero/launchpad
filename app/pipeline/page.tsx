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

    const { data: scores } = useQuery({
        queryKey: ['company_avg_scores_pipeline', selectedCohortId],
        queryFn: () => fetchCompanyAvgScores(selectedCohortId, 2),
        enabled: !!selectedCohortId,
    })

    const { stages, companies, loading: pipelineLoading } = usePipeline(selectedCohortId)

    const isLoading = programsLoading || cohortsLoading || (pipelineLoading && !!selectedCohortId)

    if (isLoading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex gap-3">
                    <Skeleton className="h-9 w-[180px] bg-surface rounded-md" />
                    <Skeleton className="h-9 w-[180px] bg-surface rounded-md" />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-[560px] w-[272px] bg-surface rounded-lg shrink-0" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-5 font-inter h-full flex flex-col animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="page-title">Deal Pipeline</h1>
                    <p className="page-subtitle">Drag and drop to move companies through stages.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                        <SelectTrigger className="w-[180px] h-9 bg-surface border-border text-[13px]">
                            <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                            {programs?.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedCohortId} onValueChange={setSelectedCohortId}>
                        <SelectTrigger className="w-[180px] h-9 bg-surface border-border text-[13px]">
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
