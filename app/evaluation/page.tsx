'use client'

import React, { useState, useEffect } from 'react'
import { usePrograms } from '@/hooks/use-programs'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Company } from '@/types'
import { Save, CheckCircle2, ClipboardCheck } from 'lucide-react'

export default function EvaluationPage() {
    const { data: programs, isLoading: programsLoading } = usePrograms()
    const [selectedProgramId, setSelectedProgramId] = useState<string>('')
    const [selectedCohortId, setSelectedCohortId] = useState<string>('')

    const { data: cohorts, isLoading: cohortsLoading } = useQuery({
        queryKey: ['cohorts_evaluation', selectedProgramId],
        queryFn: () => fetchCohorts(selectedProgramId),
        enabled: !!selectedProgramId,
    })

    const { data: companies } = useQuery({
        queryKey: ['companies_evaluation', selectedCohortId],
        queryFn: () => fetchCompanies({ cohortId: selectedCohortId }),
        enabled: !!selectedCohortId,
    })

    useEffect(() => {
        if (programs?.length && !selectedProgramId) setSelectedProgramId(programs[0].id)
    }, [programs, selectedProgramId])

    useEffect(() => {
        if (cohorts?.length && !selectedCohortId) setSelectedCohortId(cohorts[0].id)
    }, [cohorts, selectedCohortId])

    return (
        <div className="space-y-6 font-inter pb-12 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="page-title">Evaluation</h1>
                    <p className="page-subtitle">Score companies across criteria for each selection round.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                        <SelectTrigger className="w-[200px] h-9 bg-surface border-border text-[13px]">
                            <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                            {programs?.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedCohortId} onValueChange={setSelectedCohortId}>
                        <SelectTrigger className="w-[200px] h-9 bg-surface border-border text-[13px]">
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

            <Tabs defaultValue="round-2">
                <TabsList className="bg-surface border border-border p-1 h-10">
                    <TabsTrigger value="round-1" className="text-[12px] font-semibold px-4">Round 1</TabsTrigger>
                    <TabsTrigger value="round-2" className="text-[12px] font-semibold px-4">Round 2 (Full)</TabsTrigger>
                </TabsList>

                <TabsContent value="round-1" className="mt-6">
                    <div className="flex flex-col items-center justify-center h-48 bg-surface rounded-lg border border-border">
                        <ClipboardCheck className="w-10 h-10 text-text-muted/20 mb-3" />
                        <p className="text-[13px] font-medium text-text-muted text-center max-w-xs">
                            Round 1 scoring is based on internal review of the initial application.
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="round-2" className="mt-6">
                    {!selectedCohortId ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <ClipboardCheck className="w-10 h-10 text-text-muted/20 mb-3" />
                            <p className="text-[13px] font-medium text-text-muted">Select a cohort to begin scoring.</p>
                        </div>
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
    const [savedCompanies, setSavedCompanies] = useState<Set<string>>(new Set())

    const { data: existingAvgScores } = useQuery({
        queryKey: ['company_avg_scores_eval', cohortId],
        queryFn: () => fetchCompanyAvgScores(cohortId, 2),
    })

    const handleScoreChange = (companyId: string, criteriaId: string, value: number) => {
        setLocalScores(prev => ({
            ...prev,
            [companyId]: { ...(prev[companyId] || {}), [criteriaId]: value }
        }))
        setSavedCompanies(prev => { const s = new Set(prev); s.delete(companyId); return s })
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
            return { criteria_id: cId, score: val, round: 2, evaluator_id: 'current-user-id' }
        })

        const avg = Math.round((totalPoints / totalMax) * 100)

        saveMutation.mutate(
            { cohortId, companyId, round: 2, scores: scoresToSave, avgScore: avg },
            { onSuccess: () => setSavedCompanies(prev => new Set([...prev, companyId])) }
        )
    }

    if (criteriaLoading || !criteria) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full bg-surface rounded-lg" />)}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.map(company => {
                const companyId = company.id
                const currentScores = localScores[companyId] || {}
                const existingAvg = existingAvgScores?.find(s => s.company_id === companyId)?.avg_score
                const isSaved = savedCompanies.has(companyId)

                let total = 0
                let totalPossible = 0
                criteria.forEach(c => {
                    total += (currentScores[c.id] || 0) * (c.value / 5)
                    totalPossible += c.value
                })
                const currentAvg = totalPossible > 0 ? Math.round((total / totalPossible) * 100) : 0
                const displayScore = currentAvg > 0 ? currentAvg : existingAvg
                const hasChanges = Object.keys(currentScores).length > 0

                const scoreColor = displayScore
                    ? displayScore >= 70 ? 'bg-accent-primary text-white'
                        : displayScore >= 50 ? 'bg-accent-secondary text-white'
                            : 'bg-accent-danger text-white'
                    : 'bg-surface-secondary text-text-muted border border-border'

                return (
                    <Card key={companyId} className="bg-surface border-border flex flex-col group hover:shadow-md transition-all duration-200">
                        <CardHeader className="pb-3 px-5 pt-5">
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-[13px] font-bold text-text-primary uppercase tracking-wide leading-tight truncate">
                                        {company.trade_name}
                                    </CardTitle>
                                    <p className="text-[10px] text-text-muted mt-1 font-medium">{company.sector} · {company.business_stage}</p>
                                </div>
                                <Badge className={cn('text-[12px] font-bold tabular-nums px-2.5 py-0.5 shrink-0', scoreColor)}>
                                    {displayScore ?? '—'}
                                </Badge>
                            </div>

                            {/* Progress bar for current score */}
                            {displayScore && (
                                <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
                                    <div
                                        className={cn('h-full rounded-full transition-all duration-500', displayScore >= 70 ? 'bg-accent-primary' : displayScore >= 50 ? 'bg-accent-secondary' : 'bg-accent-danger')}
                                        style={{ width: `${displayScore}%` }}
                                    />
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="space-y-5 pt-3 px-5 flex-1">
                            {criteria.map((crit) => {
                                const val = currentScores[crit.id] || 0
                                return (
                                    <div key={crit.id} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{crit.title}</span>
                                            <span className={cn('text-[11px] font-bold tabular-nums', val > 0 ? 'text-accent-primary' : 'text-text-muted/40')}>
                                                {val}<span className="text-text-muted/40 font-normal"> / 5</span>
                                            </span>
                                        </div>
                                        <Slider
                                            max={5}
                                            step={1}
                                            value={[val]}
                                            onValueChange={(vals) => handleScoreChange(companyId, crit.id, vals[0])}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                )
                            })}
                        </CardContent>

                        <CardFooter className="px-5 py-4 border-t border-border bg-surface-secondary/10">
                            <Button
                                onClick={() => handleSave(companyId)}
                                className={cn(
                                    'w-full h-9 text-[12px] font-semibold transition-all',
                                    isSaved
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                        : 'bg-accent-primary text-white hover:brightness-90'
                                )}
                                disabled={saveMutation.isPending || !hasChanges}
                                size="sm"
                            >
                                {isSaved ? (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                        Saved
                                    </>
                                ) : saveMutation.isPending ? (
                                    'Saving...'
                                ) : (
                                    <>
                                        <Save className="w-3.5 h-3.5 mr-1.5" />
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
