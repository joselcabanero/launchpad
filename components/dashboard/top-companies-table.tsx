'use client'

import React from 'react'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Company, Program, CompanyAvgScore } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Trophy } from 'lucide-react'

interface TopCompaniesTableProps {
    companies: Company[]
    programs: Program[]
    scores: CompanyAvgScore[]
}

export function TopCompaniesTable({ companies, programs, scores }: TopCompaniesTableProps) {
    const data = scores
        .map(score => {
            const company = companies.find(c => c.id === score.company_id)
            const program = programs.find(p => p.id === company?.program_id)
            return {
                id: score.id,
                companyId: score.company_id,
                name: company?.trade_name || 'Unknown',
                program: program?.name || 'Unknown',
                score: score.avg_score
            }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)

    const getRankStyle = (index: number) => {
        if (index === 0) return 'bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 font-bold ring-1 ring-yellow-400/30'
        if (index === 1) return 'bg-zinc-200/50 text-zinc-500 dark:text-zinc-300 font-bold ring-1 ring-zinc-300/50'
        if (index === 2) return 'bg-amber-600/10 text-amber-700 dark:text-amber-400 font-bold ring-1 ring-amber-600/20'
        return 'text-text-muted font-medium'
    }

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'bg-accent-primary text-white'
        if (score >= 50) return 'bg-accent-secondary text-white'
        return 'bg-accent-danger text-white'
    }

    return (
        <Card className="bg-surface border-border flex-1">
            <CardHeader className="pb-0 pt-5 px-5">
                <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent-primary" />
                    <CardTitle className="text-[14px] font-semibold text-text-primary">Top Scored Companies</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0 mt-3">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="w-10 pl-5 text-[10px] text-text-muted uppercase tracking-wider">#</TableHead>
                            <TableHead className="text-[10px] text-text-muted uppercase tracking-wider">Company</TableHead>
                            <TableHead className="text-[10px] text-text-muted uppercase tracking-wider hidden sm:table-cell">Program</TableHead>
                            <TableHead className="text-right pr-5 text-[10px] text-text-muted uppercase tracking-wider">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow
                                key={item.id}
                                className="cursor-pointer hover:bg-surface-secondary/70 border-border group transition-colors"
                            >
                                <Link href={`/companies/${item.companyId}`} className="contents">
                                    <TableCell className="pl-5 py-3">
                                        <span className={cn(
                                            'inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px]',
                                            getRankStyle(index)
                                        )}>
                                            {index + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="text-[13px] font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                                            {item.name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3 hidden sm:table-cell">
                                        <span className="text-[11px] text-text-muted">{item.program}</span>
                                    </TableCell>
                                    <TableCell className="text-right pr-5 py-3">
                                        <Badge className={cn('text-[11px] font-bold tabular-nums px-2 py-0.5', getScoreColor(item.score))}>
                                            {item.score}
                                        </Badge>
                                    </TableCell>
                                </Link>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
