'use client'

import React, { useState } from 'react'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Company, DealStage, CompanyAvgScore } from '@/types'
import { KanbanColumn } from './kanban-column'
import { CompanyCard } from './company-card'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'sonner'

interface KanbanBoardProps {
    stages: DealStage[]
    companies: Company[]
    scores: CompanyAvgScore[]
}

export function KanbanBoard({ stages, companies, scores }: KanbanBoardProps) {
    const [activeCompany, setActiveCompany] = useState<Company | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current) {
            setActiveCompany(event.active.data.current as Company)
        }
    }

    const onDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveCompany(null)

        if (!over) return

        const companyId = active.id as string
        const newStageCode = over.id as string
        const company = active.data.current as Company

        if (company.tracking_stage === newStageCode) return

        try {
            await updateDoc(doc(db, 'companies', companyId), {
                tracking_stage: newStageCode,
            })
            toast.success(`${company.trade_name} moved to ${newStageCode.replace('_', ' ')}`)
        } catch (error) {
            console.error('Drag end error:', error)
            toast.error('Failed to update stage')
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
                {stages.map(stage => (
                    <KanbanColumn
                        key={stage.id}
                        stage={stage}
                        companies={companies.filter(c => c.tracking_stage === stage.code)}
                        scores={scores}
                    />
                ))}
            </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.4',
                        },
                    },
                }),
            }}>
                {activeCompany ? (
                    <CompanyCard
                        company={activeCompany}
                        score={scores.find(s => s.company_id === activeCompany.id)}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
