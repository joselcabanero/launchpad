'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ask, Company } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { format, isPast, isWithinInterval, addDays } from 'date-fns'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface TasksWidgetProps {
    tasks: Ask[]
    companies: Company[]
}

export function TasksWidget({ tasks, companies }: TasksWidgetProps) {
    const sortedTasks = tasks
        .filter(t => t.status !== 'Closed')
        .sort((a, b) => a.due_date.seconds - b.due_date.seconds)

    const overdue = sortedTasks.filter(t => isPast(t.due_date.toDate()))
    const dueSoon = sortedTasks.filter(t => {
        const d = t.due_date.toDate()
        return !isPast(d) && isWithinInterval(d, {
            start: new Date(),
            end: addDays(new Date(), 3)
        })
    })
    const upcoming = sortedTasks.filter(t => {
        const d = t.due_date.toDate()
        return !isPast(d) && !isWithinInterval(d, {
            start: new Date(),
            end: addDays(new Date(), 3)
        })
    })

    const renderTask = (task: Ask) => {
        const company = companies.find(c => c.id === task.company_id)
        return (
            <div key={task.id} className="flex flex-col p-3 border-b border-border hover:bg-surface-secondary/50 transition-colors last:border-0">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-[14px] font-medium text-text-primary leading-tight">{task.title}</h4>
                    <Badge className="bg-surface-secondary text-text-primary text-[10px] whitespace-nowrap px-1.5 py-0">
                        {task.category}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[12px] text-text-muted truncate">{company?.trade_name}</span>
                    <span className="text-[12px] text-text-muted/40">•</span>
                    <div className="flex items-center gap-1.5">
                        <Clock className={cn('w-3 h-3', isPast(task.due_date.toDate()) ? 'text-accent-danger' : 'text-text-muted')} />
                        <span className={cn(
                            'text-[11px] font-medium tabular-nums',
                            isPast(task.due_date.toDate()) ? 'text-accent-danger' : 'text-text-muted'
                        )}>
                            {format(task.due_date.toDate(), 'MMM d')}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Card className="bg-surface border-border flex-1">
            <CardHeader>
                <CardTitle className="text-base font-medium text-text-primary flex items-center justify-between">
                    <span>Open Tasks</span>
                    <Badge variant="outline" className="text-accent-primary border-accent-primary">{sortedTasks.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-auto max-h-[400px]">
                {sortedTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <CheckCircle2 className="w-10 h-10 text-accent-primary/20 mb-2" />
                        <p className="text-sm text-text-muted">No pending tasks. Great job!</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {overdue.length > 0 && (
                            <>
                                <div className="px-4 py-1 bg-accent-danger/10 flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3 text-accent-danger" />
                                    <span className="text-[10px] font-semibold text-accent-danger uppercase tracking-wider">Overdue</span>
                                </div>
                                {overdue.map(renderTask)}
                            </>
                        )}
                        {dueSoon.length > 0 && (
                            <>
                                <div className="px-4 py-1 bg-accent-secondary/10 flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-accent-secondary" />
                                    <span className="text-[10px] font-semibold text-accent-secondary uppercase tracking-wider">Due Soon</span>
                                </div>
                                {dueSoon.map(renderTask)}
                            </>
                        )}
                        {upcoming.length > 0 && (
                            <>
                                <div className="px-4 py-1 bg-muted/30 flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-text-muted" />
                                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Upcoming</span>
                                </div>
                                {upcoming.map(renderTask)}
                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
