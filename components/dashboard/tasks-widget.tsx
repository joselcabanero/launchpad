'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ask, Company } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { format, isPast, isWithinInterval, addDays } from 'date-fns'
import { Clock, CheckCircle2, AlertCircle, ListTodo } from 'lucide-react'

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
        const isTaskPast = isPast(task.due_date.toDate())
        return (
            <div key={task.id} className="flex items-start gap-3 px-5 py-3 border-b border-border/60 hover:bg-surface-secondary/40 transition-colors last:border-0 group">
                <div className={cn(
                    'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0',
                    isTaskPast ? 'bg-accent-danger' : 'bg-accent-primary'
                )} />
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-text-primary leading-tight truncate group-hover:text-accent-primary transition-colors">
                        {task.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] text-text-muted truncate">{company?.trade_name}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={cn(
                        'text-[10px] font-semibold tabular-nums',
                        isTaskPast ? 'text-accent-danger' : 'text-text-muted'
                    )}>
                        {format(task.due_date.toDate(), 'MMM d')}
                    </span>
                    <Badge className="bg-surface-secondary text-text-muted text-[9px] px-1.5 py-0 font-medium border-0">
                        {task.category}
                    </Badge>
                </div>
            </div>
        )
    }

    return (
        <Card className="bg-surface border-border flex-1">
            <CardHeader className="pb-0 pt-5 px-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ListTodo className="w-4 h-4 text-accent-primary" />
                        <CardTitle className="text-[14px] font-semibold text-text-primary">Open Tasks</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-accent-primary border-accent-primary/30 bg-accent-primary/5 text-[11px] font-semibold">
                        {sortedTasks.length}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 mt-3 overflow-auto max-h-[400px]">
                {sortedTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <CheckCircle2 className="w-9 h-9 text-accent-primary/20 mb-3" />
                        <p className="text-[13px] font-medium text-text-muted">All tasks complete!</p>
                        <p className="text-[12px] text-text-muted/60 mt-0.5">Nothing pending right now.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {overdue.length > 0 && (
                            <>
                                <div className="px-5 py-2 bg-accent-danger/8 flex items-center gap-2 border-b border-accent-danger/10">
                                    <AlertCircle className="w-3 h-3 text-accent-danger" />
                                    <span className="text-[10px] font-bold text-accent-danger uppercase tracking-widest">Overdue · {overdue.length}</span>
                                </div>
                                {overdue.map(renderTask)}
                            </>
                        )}
                        {dueSoon.length > 0 && (
                            <>
                                <div className="px-5 py-2 bg-accent-secondary/8 flex items-center gap-2 border-b border-accent-secondary/10">
                                    <Clock className="w-3 h-3 text-accent-secondary" />
                                    <span className="text-[10px] font-bold text-accent-secondary uppercase tracking-widest">Due soon · {dueSoon.length}</span>
                                </div>
                                {dueSoon.map(renderTask)}
                            </>
                        )}
                        {upcoming.length > 0 && (
                            <>
                                <div className="px-5 py-2 bg-surface-secondary/30 flex items-center gap-2 border-b border-border/50">
                                    <Clock className="w-3 h-3 text-text-muted/60" />
                                    <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest">Upcoming · {upcoming.length}</span>
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
