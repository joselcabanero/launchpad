import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchEvalCriteria, fetchCompanyAvgScores } from '@/lib/firestore'
import { doc, setDoc, query, collection, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { EvalScore, CompanyAvgScore } from '@/types'
import { toast } from 'sonner'

export function useEvalCriteria(cohortId: string, round?: number) {
    return useQuery({
        queryKey: ['eval_criteria', cohortId, round],
        queryFn: () => fetchEvalCriteria(cohortId, round),
        enabled: !!cohortId,
    })
}

export function useCompanyScores(cohortId: string, companyId: string, round?: number) {
    return useQuery({
        queryKey: ['eval_scores', cohortId, companyId, round],
        queryFn: async () => {
            const q = query(
                collection(db, 'eval_scores'),
                where('cohort_id', '==', cohortId),
                where('company_id', '==', companyId),
                where('round', '==', round)
            )
            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EvalScore))
        },
        enabled: !!cohortId && !!companyId,
    })
}

export function useSaveScores() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            cohortId,
            companyId,
            round,
            scores,
            avgScore
        }: {
            cohortId: string;
            companyId: string;
            round: number;
            scores: Partial<EvalScore>[];
            avgScore: number
        }) => {
            // 1. Delete existing scores for this round/company
            const q = query(
                collection(db, 'eval_scores'),
                where('cohort_id', '==', cohortId),
                where('company_id', '==', companyId),
                where('round', '==', round)
            )
            const snapshot = await getDocs(q)
            const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref))
            await Promise.all(deletePromises)

            // 2. Add new scores
            const scorePromises = scores.map(s => {
                const ref = doc(collection(db, 'eval_scores'))
                return setDoc(ref, { ...s, id: ref.id, cohort_id: cohortId, company_id: companyId, round })
            })
            await Promise.all(scorePromises)

            // 3. Update CompanyAvgScore
            const avgScoreRef = doc(collection(db, 'company_avg_scores'))
            // Find existing avg_score and overwrite? Simplified: just add new one and cleaning elsewhere
            // Actually let's find existing one to clean up
            const qAvg = query(
                collection(db, 'company_avg_scores'),
                where('company_id', '==', companyId),
                where('round', '==', round)
            )
            const avgSnapshot = await getDocs(qAvg)
            const avgDeletePromises = avgSnapshot.docs.map(d => deleteDoc(d.ref))
            await Promise.all(avgDeletePromises)

            await setDoc(avgScoreRef, {
                id: avgScoreRef.id,
                company_id: companyId,
                cohort_id: cohortId,
                avg_score: avgScore,
                round
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['eval_scores'] })
            queryClient.invalidateQueries({ queryKey: ['company_avg_scores'] })
            toast.success('Scores saved successfully')
        },
        onError: (error: any) => {
            toast.error('Failed to save scores: ' + error.message)
        }
    })
}
