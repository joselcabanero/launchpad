'use client'

import React, { useState, useEffect } from 'react'
import { usePrograms } from '@/hooks/use-programs'
import { useQuery } from '@tanstack/react-query'
import { fetchCohorts, fetchCompanies, fetchCompanyAvgScores } from '@/lib/firestore'
import { useEvalCriteria, useSaveScores } from '@/hooks/use-eval-scores'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Company, EvalCriteria } from '@/types'
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function EvaluationPage() {
    const { data: programs, isLoading: programsLoading } = usePrograms()
    const [selectedProgramId, setSelectedProgramId] = useState<string>('')
    const [selectedCohortId, setSelectedCohortId] = useState<string>('')

    const { data: cohorts, isLoading: cohortsLoading } = useQuery({
        queryKey: ['cohorts_evaluation', selectedProgramId],
        queryFn: () => fetchCohorts(selectedProgramId),
        enabled: !!selectedProgramId,
    })

    const { data: companies, isLoading: companiesLoading } = useQuery({
        queryKey: ['companies_evaluation', selectedCohortId],
        queryFn: () => fetchCompanies({ cohortId: selectedCohortId }),
        enabled: !!selectedCohortId,
    })

    // Set initial selected values
    useEffect(() => {
        if (programs?.length && !selectedProgramId) setSelectedProgramId(programs[0].id)
    }, [programs, selectedProgramId])

    useEffect(() => {
        if (cohorts?.length && !selectedCohortId) setSelectedCohortId(cohorts[0].id)
    }, [cohorts, selectedCohortId])

    return (
        <div className="space-y-6 font-inter pb-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Evaluation</h1>
                    <p className="text-sm text-text-muted mt-1">Score companies for selection rounds.</p>
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

            <Tabs defaultValue="round-2" className="mt-8">
                <TabsList className="bg-surface border border-border p-1">
                    <TabsTrigger value="round-1" className="w-[150px]">Round 1 (Basic)</TabsTrigger>
                    <TabsTrigger value="round-2" className="w-[150px]">Round 2 (Full)</TabsTrigger>
                </TabsList>

                <TabsContent value="round-1" className="mt-6">
                    <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-lg border border-border italic text-text-muted">
                        Round 1 scoring is based on internal review of the initial application. No sliders here.
                    </div>
                </TabsContent>

                <TabsContent value="round-2" className="mt-6">
                    {!selectedCohortId ? (
                        <div className="text-center p-12 text-text-muted">Please select a cohort to begin scoring.</div>
                    ) : (
                        <Round2Scoring cohortId={selectedCohortId} companies={companies || []} />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

function Round2Scoring({ cohortId, companies }: { cohortId: string; companies: Company[] }) {
    const { data: criteria, isLoading: criteriaLoading } = useEvalCriteria(cohortId, 2)
    const saveMutation = useSaveScores()
    const queryClient = useQueryClient()
    const [localScores, setLocalScores] = useState<Record<string, Record<string, number>>>({})

    // Fetch avg_scores to see existing scores
    const { data: existingAvgScores } = useQuery({
        queryKey: ['company_avg_scores_eval', cohortId],
        queryFn: () => fetchCompanyAvgScores(cohortId, 2),
    })

    const handleScoreChange = (companyId: string, criteriaId: string, value: number) => {
        setLocalScores(prev => ({
            ...prev,
            [companyId]: {
                ...(prev[companyId] || {}),
                [criteriaId]: value
            }
        }))
    }

    const handleSave = (companyId: string) => {
        const companyScores = localScores[companyId]
        if (!companyScores || !criteria) return

        let totalPoints = 0
        let totalMax = 0
        const scoresToSave = Object.entries(companyScores).map(([cId, val]) => {
            const crit = criteria.find(c => c.id === cId)
            if (crit) {
                totalPoints += (val / 5) * crit.value
                totalMax += crit.value
            }
            return {
                criteria_id: cId,
                score: val,
                round: 2,
                evaluator_id: 'current-user-id'
            }
        })

        const avg = Math.round((totalPoints / totalMax) * 100)

        saveMutation.mutate({
            cohortId,
            companyId,
            round: 2,
            scores: scoresToSave,
            avgScore: avg
        })
    }

    if (criteriaLoading || !criteria) {
        return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full bg-surface" />)}</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(company => {
                const companyId = company.id
                const currentScores = localScores[companyId] || {}
                const existingAvg = existingAvgScores?.find(s => s.company_id === companyId)?.avg_score

                // Calculate dynamic total
                let total = 0
                let totalPossible = 0
                criteria.forEach(c => {
                    total += (currentScores[c.id] || 0) * (c.value / 5)
                    totalPossible += c.value
                })
                const currentAvg = totalPossible > 0 ? Math.round((total / totalPossible) * 100) : 0

                return (
                    <Card key={companyId} className="bg-surface border-border flex flex-col group hover:shadow-md transition-all">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-[14px] font-bold text-text-primary uppercase group-hover:text-accent-primary transition-colors">
                                    {company.trade_name}
                                </CardTitle>
                                <Badge className={cn('font-bold transition-all', currentAvg > 0 || existingAvg ? 'bg-accent-primary' : 'bg-muted')}>
                                    {currentAvg > 0 ? currentAvg : (existingAvg || '—')}
                                </Badge>
                            </div>
                            <p className="text-[11px] text-text-muted mt-1">{company.sector} • {company.business_stage}</p>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4 px-6 flex-1">
                            {criteria.map((crit) => (
                                <div key={crit.id} className="space-y-3">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="font-semibold text-text-primary tracking-wide uppercase">{crit.title}</span>
                                        <span className="text-accent-primary font-bold tabular-nums">
                                            {currentScores[crit.id] || 0} / 5
                                        </span>
                                    </div>
                                    <Slider
                                        defaultValue={[0]}
                                        max={5}
                                        step={1}
                                        value={[currentScores[crit.id] || 0]}
                                        onValueChange={(vals) => handleScoreChange(companyId, crit.id, vals[0])}
                                        className="cursor-pointer"
                                    />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="px-6 py-4 border-t border-border bg-surface-secondary/20">
                            <Button
                                onClick={() => handleSave(companyId)}
                                className="w-full bg-accent-primary text-text-inverse h-9 text-[12px] font-semibold"
                                disabled={saveMutation.isPending || !Object.keys(currentScores).length}
                                size="sm"
                            >
                                {saveMutation.isPending ? 'Saving...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Evaluation
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
import { useQueryClient } from '@tanstack/react-query'
