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

interface TopCompaniesTableProps {
    companies: Company[]
    programs: Program[]
    scores: CompanyAvgScore[]
}

export function TopCompaniesTable({ companies, programs, scores }: TopCompaniesTableProps) {
    // Combine data
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

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'bg-accent-primary text-text-inverse'
        if (score >= 50) return 'bg-accent-secondary text-text-inverse'
        return 'bg-accent-danger text-text-inverse'
    }

    return (
        <Card className="bg-surface border-border flex-1">
            <CardHeader>
                <CardTitle className="text-base font-medium text-text-primary">Top Scored Companies</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="w-12 text-[11px] text-text-muted uppercase">#</TableHead>
                            <TableHead className="text-[11px] text-text-muted uppercase">Company</TableHead>
                            <TableHead className="text-[11px] text-text-muted uppercase">Program</TableHead>
                            <TableHead className="text-right text-[11px] text-text-muted uppercase">Avg Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow
                                key={item.id}
                                className="cursor-pointer hover:bg-surface-secondary border-border group"
                            >
                                <Link href={`/companies/${item.companyId}`} className="contents">
                                    <TableCell className="text-[13px] font-medium tabular-nums">{index + 1}</TableCell>
                                    <TableCell className="text-[13px] font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                                        {item.name}
                                    </TableCell>
                                    <TableCell className="text-[12px] text-text-muted">{item.program}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={cn('font-bold tabular-nums', getScoreColor(item.score))}>
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
