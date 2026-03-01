'use client'

import React from 'react'
import { usePrograms } from '@/hooks/use-programs'
import { useCompanies } from '@/hooks/use-companies'
import { useQuery } from '@tanstack/react-query'
import { fetchCohorts, fetchCompanyAvgScores } from '@/lib/firestore'
import { CompaniesTable } from '@/components/companies/companies-table'
import { Skeleton } from '@/components/ui/skeleton'

export default function CompaniesPage() {
    const { data: programs, isLoading: programsLoading } = usePrograms()
    const { data: companies, isLoading: companiesLoading } = useCompanies()

    const { data: cohorts, isLoading: cohortsLoading } = useQuery({
        queryKey: ['cohorts_companies_all'],
        queryFn: () => fetchCohorts()
    })

    const { data: scores, isLoading: scoresLoading } = useQuery({
        queryKey: ['company_avg_scores_all'],
        queryFn: () => fetchCompanyAvgScores('', 2) // Round 2 is the main one for evaluation
    })

    const isLoading = programsLoading || companiesLoading || cohortsLoading || scoresLoading

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-10">
                    <Skeleton className="h-10 w-64 bg-surface" />
                    <Skeleton className="h-10 w-32 bg-surface" />
                </div>
                <Skeleton className="h-[600px] w-full bg-surface" />
            </div>
        )
    }

    return (
        <div className="space-y-6 font-inter pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Companies</h1>
                    <p className="text-sm text-text-muted mt-1">Manage and track all companies across all programs and cohorts.</p>
                </div>
                <span className="text-sm text-text-muted font-medium bg-surface-secondary px-3 py-1 rounded-md tabular-nums">
                    Total: {companies?.length || 0}
                </span>
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
