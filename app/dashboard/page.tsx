'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { usePrograms } from '@/hooks/use-programs'
import { useCompanies } from '@/hooks/use-companies'
import { useAsks } from '@/hooks/use-asks'
import { useQuery } from '@tanstack/react-query'
import { fetchCompanyAvgScores } from '@/lib/firestore'
import { StatsRow } from '@/components/dashboard/stats-row'
import { TopCompaniesTable } from '@/components/dashboard/top-companies-table'
import { TasksWidget } from '@/components/dashboard/tasks-widget'
import { Skeleton } from '@/components/ui/skeleton'

// Dynamic imports for charting components (SSR breaks D3/Firestore)
const ApplicationsBar = dynamic(() => import('@/components/dashboard/applications-bar'), { ssr: false })
const StageDonut = dynamic(() => import('@/components/dashboard/stage-donut'), { ssr: false })
const PipelineFunnel = dynamic(() => import('@/components/dashboard/pipeline-funnel'), { ssr: false })

export default function DashboardPage() {
    const { data: programs, isLoading: programsLoading } = usePrograms()
    const { data: companies, isLoading: companiesLoading } = useCompanies()
    const { data: tasks, isLoading: tasksLoading } = useAsks()

    const { data: avgScores, isLoading: scoresLoading } = useQuery({
        queryKey: ['company_avg_scores_dashboard'],
        queryFn: () => fetchCompanyAvgScores('', 2)
    })

    const isLoading = programsLoading || companiesLoading || tasksLoading || scoresLoading

    if (isLoading) {
        return (
            <div className="space-y-8 font-inter animate-fade-in">
                <div className="space-y-1.5">
                    <Skeleton className="h-7 w-40 bg-surface" />
                    <Skeleton className="h-4 w-80 bg-surface" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 bg-surface rounded-lg" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-[320px] bg-surface rounded-lg" />
                    <Skeleton className="h-[320px] bg-surface rounded-lg" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-[380px] bg-surface rounded-lg" />
                    <Skeleton className="h-[380px] bg-surface rounded-lg" />
                </div>
                <Skeleton className="h-[300px] bg-surface rounded-lg" />
            </div>
        )
    }

    const barData = (programs || []).map(p => ({
        name: p.name,
        count: (companies || []).filter(c => c.program_id === p.id).length
    }))

    const stages = ['applied', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected']
    const donutData = stages.map(s => ({
        label: s.replace('_', ' ').charAt(0).toUpperCase() + s.slice(1).replace('_', ' '),
        count: (companies || []).filter(c => c.tracking_stage === s).length
    }))

    const funnelData = stages.slice(0, 5).map(s => ({
        stage: s.replace('_', ' ').charAt(0).toUpperCase() + s.slice(1).replace('_', ' '),
        count: (companies || []).filter(c => c.tracking_stage === s).length
    }))

    const totalCompanies = companies?.length || 0
    const activePrograms = (programs || []).length
    const scoresFlat = (avgScores || []).map(s => s.avg_score)
    const avgScore = scoresFlat.length > 0 ? Math.round(scoresFlat.reduce((a, b) => a + b, 0) / scoresFlat.length) : 0
    const openTasks = (tasks || []).filter(t => t.status !== 'Closed').length

    return (
        <div className="space-y-8 font-inter max-w-[1600px] mx-auto pb-12 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="page-title">Overview</h1>
                <p className="page-subtitle">Real-time accelerator program performance and pipeline tracking.</p>
            </div>

            <StatsRow
                totalCompanies={totalCompanies}
                activePrograms={activePrograms}
                avgScore={avgScore}
                openTasks={openTasks}
            />

            <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6">
                <div className="2xl:col-span-3">
                    <ApplicationsBar data={barData} />
                </div>
                <div className="2xl:col-span-2">
                    <StageDonut data={donutData} />
                </div>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                <TopCompaniesTable
                    companies={companies || []}
                    programs={programs || []}
                    scores={avgScores || []}
                />
                <TasksWidget
                    tasks={tasks || []}
                    companies={companies || []}
                />
            </div>

            <PipelineFunnel data={funnelData} />
        </div>
    )
}
