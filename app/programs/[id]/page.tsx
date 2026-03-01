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
import { ArrowLeft, Plus, Users, Calendar, Layers, ShieldCheck, Download } from 'lucide-react'
import { format } from 'date-fns'
import { StatsRow } from '@/components/dashboard/stats-row'

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

    // Calculate avg score for this program
    const { data: allScores } = useQuery({
        queryKey: ['company_avg_scores_program', id],
        queryFn: () => fetchCompanyAvgScores('', 2), // Global then filter for now or add helper
    })

    const isLoading = programLoading || companiesLoading || tasksLoading || cohortsLoading

    if (isLoading) {
        return <div className="space-y-6"><Skeleton className="h-20 w-1/3 bg-surface" /> <Skeleton className="h-[600px] w-full bg-surface" /></div>
    }

    if (!program) {
        return <div className="text-center p-12">Program not found.</div>
    }

    // Filter scores for companies in this program
    const programCompanyIds = companies?.map(c => c.id) || []
    const programScores = allScores?.filter(s => programCompanyIds.includes(s.company_id)) || []
    const avgScore = programScores.length > 0
        ? Math.round(programScores.reduce((acc, curr) => acc + curr.avg_score, 0) / programScores.length)
        : 0

    return (
        <div className="space-y-10 font-inter pb-20 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-surface-secondary text-text-muted transition-colors rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-text-primary tracking-tight">{program.name}</h1>
                        <Badge className="bg-accent-primary px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
                            {program.startup_stage}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-text-muted text-sm font-medium uppercase tracking-wider text-[11px]">
                            <Calendar className="w-3.5 h-3.5" /> Duration: {program.duration.value} {program.duration.type}
                        </div>
                        <span className="text-text-muted/30">|</span>
                        <div className="flex items-center gap-1.5 text-text-muted text-sm font-medium uppercase tracking-wider text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5" /> Partner: {program.partnerships.join(', ')}
                        </div>
                    </div>
                </div>
                <Button className="bg-accent-primary text-text-inverse hover:brightness-90 transition-all font-semibold">
                    Manage Program
                </Button>
            </div>

            <StatsRow
                totalCompanies={companies?.length || 0}
                activePrograms={cohorts?.length || 0} // Using cohorts as count here for program detail
                avgScore={avgScore}
                openTasks={tasks?.filter(t => t.status !== 'Closed').length || 0}
            />

            <div className="space-y-6 pt-6">
                <div className="flex items-center justify-between border-b border-border pb-2">
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">Cohorts</h2>
                    <Button variant="ghost" size="sm" className="text-accent-primary hover:text-accent-primary/80 font-bold uppercase tracking-wider text-[11px]">
                        Add Cohort
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cohorts?.map(cohort => {
                        const cohortCompanies = companies?.filter(c => c.cohort_id === cohort.id) || []
                        return (
                            <Card key={cohort.id} className="bg-surface border-border shadow-sm group hover:border-accent-primary/40 transition-all">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors">{cohort.name}</CardTitle>
                                    <CardDescription className="text-text-muted text-[12px] h-10 overflow-hidden line-clamp-2">
                                        {cohort.description || "No description provided."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-text-muted/60" />
                                            <span className="text-[14px] font-bold text-text-primary">{cohortCompanies.length}</span>
                                            <span className="text-[11px] text-text-muted uppercase font-medium">Companies</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-text-muted/60" />
                                            <span className="text-[13px] font-medium text-text-primary">
                                                {format(cohort.start_date.toDate(), 'MMM yyyy')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden flex">
                                        <div className="h-full bg-accent-primary" style={{ width: '40%' }} />
                                        <div className="h-full bg-accent-secondary" style={{ width: '30%' }} />
                                        <div className="h-full bg-accent-danger" style={{ width: '20%' }} />
                                        <div className="h-full bg-accent-deep" style={{ width: '10%' }} />
                                    </div>
                                    <div className="flex justify-between text-[9px] text-text-muted font-bold uppercase tracking-widest pt-1">
                                        <span>Applied</span>
                                        <span>Review</span>
                                        <span>Selected</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-6 pt-10">
                <div className="flex items-center justify-between border-b border-border pb-2">
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">Active Companies</h2>
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
