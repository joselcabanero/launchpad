'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePrograms } from '@/hooks/use-programs'
import { useCompanies } from '@/hooks/use-companies'
import { useQuery } from '@tanstack/react-query'
import { fetchCohorts } from '@/lib/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Plus, Users, Calendar, Layers, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProgramsPage() {
    const [search, setSearch] = useState('')
    const { data: programs, isLoading: programsLoading } = usePrograms()
    const { data: companies, isLoading: companiesLoading } = useCompanies()

    const { data: cohorts, isLoading: cohortsLoading } = useQuery({
        queryKey: ['cohorts_all_programs'],
        queryFn: () => fetchCohorts()
    })

    const isLoading = programsLoading || companiesLoading || cohortsLoading

    const filteredPrograms = (programs || []).filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-10">
                    <Skeleton className="h-10 w-64 bg-surface" />
                    <Skeleton className="h-10 w-32 bg-surface" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 w-full bg-surface" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 font-inter pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Accelerator Programs</h1>
                    <p className="text-sm text-text-muted mt-1">Select a program to manage cohorts and companies.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted transition-colors" />
                        <Input
                            placeholder="Search programs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-surface border-border focus:ring-accent-primary"
                        />
                    </div>
                    <Button className="bg-accent-primary text-text-inverse hover:brightness-90 transition-all font-semibold">
                        <Plus className="w-4 h-4 mr-2" /> New Program
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPrograms.map((p) => {
                    const programCohorts = cohorts?.filter(c => c.program_id === p.id) || []
                    const programCompanies = companies?.filter(c => c.program_id === p.id) || []

                    return (
                        <Link key={p.id} href={`/programs/${p.id}`} className="group h-full">
                            <Card className="bg-surface border-border group-hover:border-accent-primary transition-all shadow-sm group-hover:shadow-md relative overflow-hidden h-full flex flex-col">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-accent-primary" />
                                <CardHeader className="pt-8 pb-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors leading-tight">{p.name}</CardTitle>
                                        <ShieldCheck className="w-5 h-5 text-accent-primary shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {p.sector.map(s => (
                                            <Badge key={s} variant="outline" className="text-[10px] bg-white border-border text-text-muted font-normal uppercase tracking-wider px-1.5 py-0">
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-3.5 h-3.5 text-text-muted/60" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-text-muted uppercase font-semibold">Cohorts</span>
                                                <span className="text-[14px] font-bold text-text-primary tabular-nums">{programCohorts.length}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-right justify-end md:justify-start">
                                            <Users className="w-3.5 h-3.5 text-text-muted/60" />
                                            <div className="flex flex-col items-start">
                                                <span className="text-[10px] text-text-muted uppercase font-semibold">Companies</span>
                                                <span className="text-[14px] font-bold text-text-primary tabular-nums">{programCompanies.length}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-text-muted/60" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-text-muted uppercase font-semibold">Duration</span>
                                                <span className="text-[13px] font-medium text-text-primary tabular-nums">{p.duration.value} {p.duration.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-surface-secondary/20 pt-4 border-t border-border mt-auto">
                                    <div className="flex flex-col w-full">
                                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Lead Partner</span>
                                        <span className="text-[13px] font-bold text-accent-primary mt-0.5">{p.partnerships[0] || 'Internal'}</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
