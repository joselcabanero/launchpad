'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Company, Program, Cohort, CompanyAvgScore } from '@/types'
import { Search, Download, Building2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface CompaniesTableProps {
    companies: Company[]
    programs: Program[]
    cohorts: Cohort[]
    scores: CompanyAvgScore[]
}

export function CompaniesTable({ companies, programs, cohorts, scores }: CompaniesTableProps) {
    const [search, setSearch] = useState('')
    const [programFilter, setProgramFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredCompanies = useMemo(() => {
        return companies.filter(c => {
            const matchesSearch = c.trade_name.toLowerCase().includes(search.toLowerCase())
            const matchesProgram = programFilter === 'all' || c.program_id === programFilter
            const matchesStatus = statusFilter === 'all' || c.bz_approval === statusFilter
            return matchesSearch && matchesProgram && matchesStatus
        })
    }, [companies, search, programFilter, statusFilter])

    const exportCSV = () => {
        const headers = ['Trade Name', 'Program', 'Cohort', 'Sector', 'Business Stage', 'Status', 'Avg Score', 'Applied']
        const rows = filteredCompanies.map(c => {
            const program = programs.find(p => p.id === c.program_id)?.name
            const cohort = cohorts.find(ch => ch.id === c.cohort_id)?.name
            const score = scores.find(s => s.company_id === c.id)?.avg_score || '—'
            return [
                c.trade_name,
                program,
                cohort,
                c.sector,
                c.business_stage,
                c.bz_approval.toUpperCase(),
                score,
                format(c.createdDate.toDate(), 'yyyy-MM-dd')
            ]
        })

        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n')
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `companies_export_${format(new Date(), 'yyyy-MM-dd')}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'accepted': return <Badge className="bg-accent-primary text-text-inverse">Accepted</Badge>
            case 'pending': return <Badge className="bg-accent-secondary text-text-inverse">Pending</Badge>
            case 'rejected': return <Badge className="bg-accent-danger text-text-inverse">Rejected</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="sticky top-16 z-20 bg-background/95 backdrop-blur py-4 flex flex-col gap-4 border-b border-border">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <Input
                            placeholder="Search by trade name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-surface border-border focus:ring-accent-primary"
                        />
                    </div>
                    <Select value={programFilter} onValueChange={setProgramFilter}>
                        <SelectTrigger className="w-[200px] bg-surface border-border">
                            <SelectValue placeholder="All Programs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Programs</SelectItem>
                            {programs.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        onClick={exportCSV}
                        className="border-accent-primary text-accent-primary hover:bg-accent-primary/5 ml-auto"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
                    <TabsList className="bg-surface border border-border p-1 w-full justify-start">
                        <TabsTrigger value="all" className="flex-1 max-w-[120px]">All</TabsTrigger>
                        <TabsTrigger value="accepted" className="flex-1 max-w-[120px]">Accepted</TabsTrigger>
                        <TabsTrigger value="pending" className="flex-1 max-w-[120px]">Pending</TabsTrigger>
                        <TabsTrigger value="rejected" className="flex-1 max-w-[120px]">Rejected</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="rounded-lg border border-border bg-surface overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-surface-secondary/30">
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="text-[11px] text-text-muted uppercase font-bold py-4">Company Name</TableHead>
                            <TableHead className="text-[11px] text-text-muted uppercase font-bold">Program</TableHead>
                            <TableHead className="text-[11px] text-text-muted uppercase font-bold">Sector</TableHead>
                            <TableHead className="text-[11px] text-text-muted uppercase font-bold">Stage</TableHead>
                            <TableHead className="text-[11px] text-text-muted uppercase font-bold">Status</TableHead>
                            <TableHead className="text-[11px] text-text-muted uppercase font-bold text-center">Avg Score</TableHead>
                            <TableHead className="text-[11px] text-text-muted uppercase font-bold text-right">Applied</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCompanies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Building2 className="w-10 h-10 text-text-muted/20" />
                                        <p className="text-sm font-medium text-text-muted">No companies found matching your filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCompanies.map(c => {
                                const program = programs.find(p => p.id === c.program_id)
                                const score = scores.find(s => s.company_id === c.id)
                                return (
                                    <TableRow key={c.id} className="cursor-pointer hover:bg-surface-secondary/50 border-border group transition-colors">
                                        <TableCell className="py-4">
                                            <Link href={`/companies/${c.id}`} className="flex flex-col">
                                                <span className="text-[13px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors flex items-center gap-1.5">
                                                    {c.trade_name}
                                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </span>
                                                <span className="text-[11px] text-text-muted">{c.city}, {c.country}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-[12px] text-text-muted font-medium">{program?.name || '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] bg-white border-border text-text-muted font-normal uppercase tracking-wider">
                                                {c.sector}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-[12px] text-text-primary">{c.business_stage}</TableCell>
                                        <TableCell>{getStatusBadge(c.bz_approval)}</TableCell>
                                        <TableCell className="text-center font-bold tabular-nums text-[13px]">
                                            {score ? (
                                                <span className={cn(
                                                    score.avg_score >= 70 ? 'text-accent-primary' :
                                                        score.avg_score >= 50 ? 'text-accent-secondary' : 'text-accent-danger'
                                                )}>
                                                    {score.avg_score}
                                                </span>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell className="text-right text-[12px] text-text-muted tabular-nums">
                                            {format(c.createdDate.toDate(), 'MMM d, yyyy')}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
