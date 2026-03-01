'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Company, DealStage } from '@/types'

export function usePipeline(cohortId: string) {
    const [companies, setCompanies] = useState<Company[]>([])
    const [stages, setStages] = useState<DealStage[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!cohortId) return

        setTimeout(() => setLoading(true), 0)

        // Real-time stages
        const qStages = query(collection(db, 'deal_stages'), where('cohort_id', '==', cohortId), orderBy('sequence'))
        const unsubscribeStages = onSnapshot(qStages, (snapshot) => {
            setStages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DealStage)))
        })

        // Real-time companies
        const qCompanies = query(collection(db, 'companies'), where('cohort_id', '==', cohortId))
        const unsubscribeCompanies = onSnapshot(qCompanies, (snapshot) => {
            setCompanies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company)))
            setLoading(false)
        })

        return () => {
            unsubscribeStages()
            unsubscribeCompanies()
        }
    }, [cohortId])

    return { stages, companies, loading }
}
