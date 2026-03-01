'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProgram } from '@/hooks/use-programs'
import { useCompanies } from '@/hooks/use-companies'
import { useAsks } from '@/hooks/use-asks'
import { useQuery } from '@tanstack/react-query'
import { fetchCohorts, fetchCompanyAvgScores } from '@/lib/firestore'
import { CompaniesTable } from '@/components/companies/companies-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Users, Calendar, Layers, ShieldCheck } from 'lucide-react'
import { format } from 'date-fns'
import { StatsRow } from '@/components/dashboard/stats-row'
import { cn } from '@/lib/utils'

export default function ProgramDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: program, isLoading: programLoading } = useProgram(id as string)
    const { data: companies, isLoading: companiesLoading } = useCompanies({ programId: id as string })
    const { data: tasks, isLoading: tasksLoading } = useAsks({ programId: id as string })

    const { data: cohorts, isLoading: cohortsLoading } = useQuery({
        queryKey: ['cohorts_program', id],
        queryFn: () => fetchCohorts(id as string),
        enabled: !!id,
    })

    const { data: allScores } = useQuery({
        queryKey: ['company_avg_scores_program', id],
        queryFn: () => fetchCompanyAvgScores('', 2),
    })

    const isLoading = programLoading || companiesLoading || tasksLoading || cohortsLoading

    if (isLoading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <Skeleton className="h-20 w-1/3 bg-surface rounded-lg" />
                <Skeleton className="h-[600px] w-full bg-surface rounded-lg" />
            </div>
        )
    }

    if (!program) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <Layers className="w-12 h-12 text-text-muted/20 mb-4" />
                <p className="text-[15px] font-semibold text-text-muted">Program not found.</p>
            </div>
        )
    }

    const programCompanyIds = companies?.map(c => c.id) || []
    const programScores = allScores?.filter(s => programCompanyIds.includes(s.company_id)) || []
    const avgScore = programScores.length > 0
        ? Math.round(programScores.reduce((acc, curr) => acc + curr.avg_score, 0) / programScores.length)
        : 0

    return (
        <div className="space-y-8 font-inter pb-20 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-surface-secondary text-text-muted transition-colors rounded-full shrink-0 mt-1"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-text-primary tracking-tight">{program.name}</h1>
                        <Badge className="bg-accent-primary/10 text-accent-primary border border-accent-primary/20 text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider rounded-full">
                            {program.startup_stage}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[11px] text-text-muted font-medium">
                            <Calendar className="w-3 h-3" /> {program.duration.value} {program.duration.type}
                        </span>
                        <span className="text-text-muted/30">·</span>
                        <span className="flex items-center gap-1 text-[11px] text-text-muted font-medium">
                            <ShieldCheck className="w-3 h-3" /> {program.partnerships.join(', ')}
                        </span>
                    </div>
                </div>
                <Button className="h-9 bg-accent-primary text-white hover:brightness-90 transition-all font-semibold text-[13px] shrink-0">
                    Manage Program
                </Button>
            </div>

            <StatsRow
                totalCompanies={companies?.length || 0}
                activePrograms={cohorts?.length || 0}
                avgScore={avgScore}
                openTasks={tasks?.filter(t => t.status !== 'Closed').length || 0}
            />

            {/* Cohorts */}
            <div className="space-y-5">
                <div className="section-divider">
                    <h2 className="section-title">Cohorts</h2>
                    <Button variant="ghost" size="sm" className="text-accent-primary hover:text-accent-primary/80 font-bold uppercase tracking-wider text-[11px] h-8">
                        + Add Cohort
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cohorts?.map(cohort => {
                        const cohortCompanies = companies?.filter(c => c.cohort_id === cohort.id) || []
                        return (
                            <Card key={cohort.id} className="bg-surface border-border shadow-sm group hover:border-accent-primary/40 hover:shadow-md transition-all duration-200">
                                <CardHeader className="pb-3 px-5 pt-5">
                                    <CardTitle className="text-[14px] font-bold text-text-primary group-hover:text-accent-primary transition-colors">{cohort.name}</CardTitle>
                                    <CardDescription className="text-text-muted text-[12px] line-clamp-2 mt-1">
                                        {cohort.description || 'No description provided.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="px-5 pb-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-text-muted/50" />
                                            <span className="text-[15px] font-bold text-text-primary tabular-nums">{cohortCompanies.length}</span>
                                            <span className="text-[11px] text-text-muted uppercase font-semibold">companies</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-text-muted/50" />
                                            <span className="text-[12px] font-semibold text-text-muted">
                                                {format(cohort.start_date.toDate(), 'MMM yyyy')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stage distribution bar */}
                                    <div className="space-y-1.5">
                                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden flex">
                                            <div className="h-full bg-accent-primary transition-all" style={{ width: '40%' }} />
                                            <div className="h-full bg-accent-secondary transition-all" style={{ width: '30%' }} />
                                            <div className="h-full bg-accent-danger transition-all" style={{ width: '20%' }} />
                                            <div className="h-full bg-accent-deep transition-all" style={{ width: '10%' }} />
                                        </div>
                                        <div className="flex justify-between text-[9px] text-text-muted/50 font-bold uppercase tracking-widest">
                                            <span>Applied</span>
                                            <span>Review</span>
                                            <span>Selected</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Companies */}
            <div className="space-y-5">
                <div className="section-divider">
                    <h2 className="section-title">Active Companies</h2>
                    <Badge className="bg-surface-secondary text-text-muted border border-border text-[11px] font-semibold px-2.5 py-0.5">
                        {companies?.length || 0}
                    </Badge>
                </div>
                <CompaniesTable
                    companies={companies || []}
                    programs={[program]}
                    cohorts={cohorts || []}
                    scores={allScores || []}
                />
            </div>
        </div>
    )
}
