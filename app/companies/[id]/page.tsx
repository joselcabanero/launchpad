'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useCompany } from '@/hooks/use-companies'
import { useAsks } from '@/hooks/use-asks'
import { useEvalCriteria, useCompanyScores } from '@/hooks/use-eval-scores'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Globe, MapPin, Calendar, Users, Building, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const ScoreRadar = dynamic(() => import('@/components/companies/score-radar'), { ssr: false })

export default function CompanyDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: company, isLoading: companyLoading } = useCompany(id as string)
    const { data: tasks, isLoading: tasksLoading } = useAsks({ companyId: id as string })

    const { data: criteria } = useEvalCriteria(company?.cohort_id || '', 2)
    const { data: scores } = useCompanyScores(company?.cohort_id || '', id as string, 2)

    const isLoading = companyLoading || tasksLoading

    if (isLoading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <Skeleton className="h-20 w-1/3 bg-surface" />
                <Skeleton className="h-[600px] w-full bg-surface rounded-lg" />
            </div>
        )
    }

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <Building className="w-12 h-12 text-text-muted/20 mb-4" />
                <p className="text-[15px] font-semibold text-text-muted">Company not found</p>
            </div>
        )
    }

    const radarData = criteria?.map(c => {
        const score = scores?.find(s => s.criteria_id === c.id)
        return { axis: c.title, value: score?.score || 0 }
    }) || []

    const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '')

    const approvalColor = company.bz_approval === 'accepted'
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        : company.bz_approval === 'pending'
            ? 'bg-accent-primary/10 text-accent-primary'
            : 'bg-accent-danger/10 text-accent-danger'

    const initials = company.trade_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

    return (
        <div className="space-y-6 font-inter pb-20 max-w-7xl mx-auto animate-fade-in">
            {/* Back + Hero header */}
            <div className="flex items-start gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-surface-secondary text-text-muted transition-colors rounded-full shrink-0 mt-1"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Company avatar */}
                    <div className="w-14 h-14 rounded-xl bg-accent-primary/10 flex items-center justify-center shrink-0 border border-accent-primary/20">
                        <span className="text-lg font-bold text-accent-primary">{initials}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-2xl font-bold text-text-primary tracking-tight">{company.trade_name}</h1>
                            <Badge className={cn('text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider rounded-full', approvalColor)}>
                                {company.bz_approval}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[11px] text-text-muted font-medium">
                                <MapPin className="w-3 h-3" /> {company.city}, {company.country}
                            </span>
                            <span className="text-text-muted/30">·</span>
                            <span className="flex items-center gap-1 text-[11px] text-text-muted font-medium">
                                <Building className="w-3 h-3" /> {company.sector}
                            </span>
                            {company.website && (
                                <>
                                    <span className="text-text-muted/30">·</span>
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[11px] text-accent-primary hover:text-accent-secondary font-semibold transition-colors"
                                    >
                                        <Globe className="w-3 h-3" /> Website
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-3 space-y-5">
                    {/* Company Info */}
                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-3 px-5 pt-5">
                            <CardTitle className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Company Info</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1">
                                        <Building className="w-3 h-3" /> Business Stage
                                    </p>
                                    <p className="text-[14px] font-bold text-text-primary mt-1">{company.business_stage}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Sub-sectors
                                    </p>
                                    <p className="text-[13px] font-semibold text-text-primary mt-1">{company.sub_sectors?.join(', ') || 'N/A'}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Applied
                                    </p>
                                    <p className="text-[14px] font-bold text-text-primary mt-1">{format(company.createdDate.toDate(), 'MMM yyyy')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application Answers */}
                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-3 px-5 pt-5">
                            <CardTitle className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Application Answers</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 space-y-5">
                            {[
                                { q: "What is your unique value proposition?", a: "We leverage proprietary AI models to optimize food distribution logistics, reducing waste by 40%." },
                                { q: "Describe your current traction.", a: "Over 50 paid B2B clients in the EU market, processing $2M AR in 2024." },
                                { q: "What is your funding history?", a: "Bootstrapped to $50k MRR, followed by a $1.2M pre-seed round in late 2023." }
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5 pb-5 border-b border-border/50 last:border-0 last:pb-0">
                                    <p className="text-[12px] font-bold text-text-primary leading-snug">{stripHtml(item.q)}</p>
                                    <p className="text-[13px] text-text-muted leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-3 px-5 pt-5">
                            <CardTitle className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <div className="space-y-0">
                                {[
                                    { label: `Status updated to ${company.bz_approval.toUpperCase()}`, date: company.createdDate.toDate(), active: true },
                                    { label: 'Application Submitted', date: company.createdDate.toDate(), active: false },
                                ].map((event, i) => (
                                    <div key={i} className="flex gap-3 pb-5 last:pb-0 relative">
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                'w-2.5 h-2.5 rounded-full shrink-0 mt-1',
                                                event.active ? 'bg-accent-primary' : 'bg-border'
                                            )} />
                                            {i < 1 && <div className="w-px flex-1 bg-border mt-1" />}
                                        </div>
                                        <div className="pb-1">
                                            <p className="text-[13px] font-semibold text-text-primary">{event.label}</p>
                                            <p className="text-[11px] text-text-muted mt-0.5">{format(event.date, 'MMMM d, yyyy')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-2 space-y-5">
                    <ScoreRadar data={radarData} />

                    {/* Open Tasks */}
                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-3 px-5 pt-5">
                            <CardTitle className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Open Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {tasks && tasks.filter(t => t.status !== 'Closed').length > 0 ? (
                                tasks.filter(t => t.status !== 'Closed').map(task => (
                                    <div key={task.id} className="px-5 py-3.5 border-b border-border last:border-0 hover:bg-surface-secondary/30 transition-colors">
                                        <p className="text-[13px] font-semibold text-text-primary leading-tight">{task.title}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Badge className="bg-surface-secondary text-text-muted h-5 text-[9px] px-1.5 py-0 font-semibold uppercase border-0">
                                                {task.category}
                                            </Badge>
                                            <div className="flex items-center gap-1 ml-auto">
                                                <Clock className="w-3 h-3 text-accent-danger" />
                                                <span className="text-[11px] text-accent-danger font-semibold tabular-nums">
                                                    {format(task.due_date.toDate(), 'MMM d')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-5 py-10 text-center text-[12px] text-text-muted">No open tasks.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Labels */}
                    <Card className="bg-surface border-border shadow-sm">
                        <CardHeader className="pb-3 px-5 pt-5">
                            <CardTitle className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Labels</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 flex flex-wrap gap-2">
                            <Badge className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 border flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" /> High Impact
                            </Badge>
                            <Badge className="bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20 border flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary" /> Agritech Specialist
                            </Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
