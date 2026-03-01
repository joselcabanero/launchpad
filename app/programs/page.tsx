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
import { Search, Plus, Users, Calendar, Layers, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Accent colors cycle for visual variety
const CARD_ACCENTS = [
    'bg-accent-primary',
    'bg-accent-secondary',
    'bg-accent-deep',
    'bg-accent-danger',
    'bg-accent-primary',
    'bg-accent-secondary',
]

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
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-56 bg-surface" />
                    <Skeleton className="h-9 w-32 bg-surface" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-52 w-full bg-surface rounded-lg" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 font-inter pb-20 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="page-title">Accelerator Programs</h1>
                    <p className="page-subtitle">Select a program to manage cohorts and companies.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-[260px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                        <Input
                            placeholder="Search programs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 bg-surface border-border focus-visible:ring-accent-primary text-[13px]"
                        />
                    </div>
                    <Button className="h-9 bg-accent-primary text-white hover:brightness-90 transition-all font-semibold text-[13px]">
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> New Program
                    </Button>
                </div>
            </div>

            {filteredPrograms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <Layers className="w-12 h-12 text-text-muted/20 mb-4" />
                    <p className="text-[15px] font-semibold text-text-muted">No programs found</p>
                    <p className="text-[13px] text-text-muted/60 mt-1">Try adjusting your search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((p, i) => {
                        const programCohorts = cohorts?.filter(c => c.program_id === p.id) || []
                        const programCompanies = companies?.filter(c => c.program_id === p.id) || []
                        const accent = CARD_ACCENTS[i % CARD_ACCENTS.length]

                        return (
                            <Link key={p.id} href={`/programs/${p.id}`} className="group h-full">
                                <Card className="bg-surface border-border group-hover:border-accent-primary/40 group-hover:shadow-lg transition-all duration-200 relative overflow-hidden h-full flex flex-col">
                                    {/* Top accent bar */}
                                    <div className={cn('h-1 w-full', accent)} />

                                    <CardHeader className="pt-5 pb-3 px-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-[15px] font-bold text-text-primary group-hover:text-accent-primary transition-colors leading-tight">
                                                {p.name}
                                            </CardTitle>
                                            <ArrowUpRight className="w-4 h-4 text-text-muted/30 group-hover:text-accent-primary group-hover:opacity-100 transition-all shrink-0 mt-0.5" />
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {p.sector.slice(0, 3).map(s => (
                                                <Badge key={s} variant="outline" className="text-[9px] bg-background border-border text-text-muted font-medium uppercase tracking-wider px-1.5 py-0">
                                                    {s}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 px-5 pb-4">
                                        <div className="grid grid-cols-3 gap-3 pt-1">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1 text-text-muted/50">
                                                    <Layers className="w-3 h-3" />
                                                    <span className="text-[9px] uppercase font-bold tracking-wider">Cohorts</span>
                                                </div>
                                                <span className="text-[18px] font-bold text-text-primary tabular-nums">{programCohorts.length}</span>
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1 text-text-muted/50">
                                                    <Users className="w-3 h-3" />
                                                    <span className="text-[9px] uppercase font-bold tracking-wider">Companies</span>
                                                </div>
                                                <span className="text-[18px] font-bold text-text-primary tabular-nums">{programCompanies.length}</span>
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1 text-text-muted/50">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[9px] uppercase font-bold tracking-wider">Duration</span>
                                                </div>
                                                <span className="text-[13px] font-bold text-text-primary">{p.duration.value}<span className="text-[11px] font-medium text-text-muted ml-0.5">{p.duration.type}</span></span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="px-5 py-3 border-t border-border bg-surface-secondary/10 mt-auto">
                                        <div className="flex items-center justify-between w-full">
                                            <div>
                                                <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">Lead Partner</p>
                                                <p className="text-[12px] font-bold text-accent-primary mt-0.5">{p.partnerships[0] || 'Internal'}</p>
                                            </div>
                                            <Badge className={cn('text-white text-[9px] px-2 py-0.5 font-semibold uppercase tracking-wider', accent)}>
                                                {p.startup_stage}
                                            </Badge>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
