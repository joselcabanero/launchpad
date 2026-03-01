'use client'

import React from 'react'
import { usePrograms } from '@/hooks/use-programs'
import { useCompanies } from '@/hooks/use-companies'
import { useQuery } from '@tanstack/react-query'
import { fetchCohorts, fetchCompanyAvgScores } from '@/lib/firestore'
import { CompaniesTable } from '@/components/companies/companies-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function CompaniesPage() {
    const { data: programs, isLoading: programsLoading } = usePrograms()
    const { data: companies, isLoading: companiesLoading } = useCompanies()

    const { data: cohorts, isLoading: cohortsLoading } = useQuery({
        queryKey: ['cohorts_companies_all'],
        queryFn: () => fetchCohorts()
    })

    const { data: scores, isLoading: scoresLoading } = useQuery({
        queryKey: ['company_avg_scores_all'],
        queryFn: () => fetchCompanyAvgScores('', 2)
    })

    const isLoading = programsLoading || companiesLoading || cohortsLoading || scoresLoading

    if (isLoading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48 bg-surface" />
                    <Skeleton className="h-7 w-20 bg-surface rounded-full" />
                </div>
                <Skeleton className="h-[600px] w-full bg-surface rounded-lg" />
            </div>
        )
    }

    return (
        <div className="space-y-6 font-inter pb-12 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Companies</h1>
                    <p className="page-subtitle">Manage and track all companies across all programs and cohorts.</p>
                </div>
                <Badge className="bg-surface-secondary text-text-muted border border-border text-[12px] font-semibold tabular-nums px-3 py-1">
                    {companies?.length || 0} total
                </Badge>
            </div>

            <CompaniesTable
                companies={companies || []}
                programs={programs || []}
                cohorts={cohorts || []}
                scores={scores || []}
            />
        </div>
    )
}
