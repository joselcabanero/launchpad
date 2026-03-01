'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useCompany } from '@/hooks/use-companies'
import { useAsks } from '@/hooks/use-asks'
import { useEvalCriteria, useCompanyScores } from '@/hooks/use-eval-scores'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Globe, MapPin, ExternalLink, Calendar, Users, Building } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const ScoreRadar = dynamic(() => import('@/components/companies/score-radar'), { ssr: false })

export default function CompanyDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: company, isLoading: companyLoading } = useCompany(id as string)
    const { data: tasks, isLoading: tasksLoading } = useAsks({ companyId: id as string })

    // Scoring data
    const { data: criteria } = useEvalCriteria(company?.cohort_id || '', 2)
    const { data: scores } = useCompanyScores(company?.cohort_id || '', id as string, 2)

    const isLoading = companyLoading || tasksLoading

    if (isLoading) {
        return <div className="space-y-6"><Skeleton className="h-20 w-1/3 bg-surface" /> <Skeleton className="h-[600px] w-full bg-surface" /></div>
    }

    if (!company) {
        return <div className="text-center p-12">Company not found.</div>
    }

    const radarData = criteria?.map(c => {
        const score = scores?.find(s => s.criteria_id === c.id)
        return {
            axis: c.title,
            value: score?.score || 0
        }
    }) || []

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '')
    }

    return (
        <div className="space-y-6 font-inter pb-20 max-w-7xl mx-auto">
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
                        <h1 className="text-2xl font-bold text-text-primary tracking-tight">{company.trade_name}</h1>
                        <Badge className={cn(
                            'px-3 py-1 font-semibold uppercase tracking-wider text-[10px]',
                            company.bz_approval === 'accepted' ? 'bg-accent-primary' :
                                company.bz_approval === 'pending' ? 'bg-accent-secondary' : 'bg-accent-danger'
                        )}>
                            {company.bz_approval}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-text-muted text-sm font-medium uppercase tracking-wider text-[11px]">
                            <MapPin className="w-3.5 h-3.5" /> {company.city}, {company.country}
                        </div>
                        <span className="text-text-muted/30">|</span>
                        <div className="flex items-center gap-1.5 text-text-muted text-sm font-medium uppercase tracking-wider text-[11px]">
                            <Building className="w-3.5 h-3.5" /> {company.sector}
                        </div>
                        {company.website && (
                            <>
                                <span className="text-text-muted/30">|</span>
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-accent-primary hover:text-accent-secondary text-sm font-bold uppercase tracking-wider text-[11px] transition-colors"
                                >
                                    <Globe className="w-3.5 h-3.5" /> Website
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* LEFT COLUMN (60%) */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Company Info</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[11px] text-text-muted flex items-center gap-1.5"><Building className="w-3 h-3" /> Business Stage</p>
                                <p className="text-[14px] font-bold text-text-primary">{company.business_stage}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] text-text-muted flex items-center gap-1.5"><Users className="w-3 h-3" /> Sub-sectors</p>
                                <p className="text-[14px] font-bold text-text-primary">{company.sub_sectors?.join(', ') || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] text-text-muted flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Founded</p>
                                <p className="text-[14px] font-bold text-text-primary">{format(company.createdDate.toDate(), 'yyyy')}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Application Answers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { q: "What is your unique value proposition?", a: "We leverage proprietary AI models to optimize food distribution logistics, reducing waste by 40%." },
                                { q: "Describe your current traction.", a: "Over 50 paid B2B clients in the EU market, processing $2M AR in 2024." },
                                { q: "What is your funding history?", a: "Bootstrapped to $50k MRR, followed by a $1.2M pre-seed round in late 2023." }
                            ].map((item, i) => (
                                <div key={i} className="space-y-2 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                    <p className="text-[13px] font-bold text-text-primary leading-snug">{stripHtml(item.q)}</p>
                                    <p className="text-[14px] text-text-muted leading-relaxed italic">{item.a}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-px bg-border relative ml-2">
                                    <div className="absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full bg-accent-primary" />
                                    <div className="absolute top-16 -left-[5px] w-2.5 h-2.5 rounded-full bg-border" />
                                </div>
                                <div className="flex-1 space-y-8">
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-bold text-text-primary">Status updated to {company.bz_approval.toUpperCase()}</p>
                                        <p className="text-[11px] text-text-muted">{format(company.createdDate.toDate(), 'MMMM d, yyyy')}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-bold text-text-primary">Application Submitted</p>
                                        <p className="text-[11px] text-text-muted">{format(company.createdDate.toDate(), 'MMMM d, yyyy')}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN (40%) */}
                <div className="lg:col-span-2 space-y-8">
                    <ScoreRadar data={radarData} />

                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Open Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {tasks && tasks.length > 0 ? (
                                tasks.filter(t => t.status !== 'Closed').map(task => (
                                    <div key={task.id} className="p-4 border-b border-border last:border-0 hover:bg-surface-secondary/30 transition-colors">
                                        <p className="text-[13px] font-bold text-text-primary">{task.title}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge className="bg-muted text-text-muted h-5 text-[10px] px-1.5 py-0">{task.category}</Badge>
                                            <span className="text-[11px] text-accent-danger font-semibold tabular-nums ml-auto">
                                                {format(task.due_date.toDate(), 'MMM d')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-[12px] text-text-muted">No open tasks for this company.</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Labels</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Badge className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 flex items-center gap-1.5 px-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" /> High Impact
                            </Badge>
                            <Badge className="bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20 flex items-center gap-1.5 px-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary" /> Agritech Specialist
                            </Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
