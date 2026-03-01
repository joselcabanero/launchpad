import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    limit,
    Timestamp,
    type DocumentData,
    type QueryConstraint
} from 'firebase/firestore'
import { db } from './firebase'
import { Program, Cohort, Company, DealStage, EvalCriteria, EvalScore, CompanyAvgScore, Ask, AppUser } from '@/types'

// Generic helper to get a collection with types
export const getCollection = async <T extends DocumentData>(
    collectionName: string,
    ...constraints: QueryConstraint[]
): Promise<T[]> => {
    const q = query(collection(db, collectionName), ...constraints)
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
}

// Generic helper to get a single document
export const getDocument = async <T extends DocumentData>(
    collectionName: string,
    id: string
): Promise<T | null> => {
    const docRef = doc(db, collectionName, id)
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as T
    }
    return null
}

// Specific helpers
export const fetchPrograms = () => getCollection<Program>('programs', orderBy('name'))
export const fetchCohorts = (programId?: string) => {
    const constraints: QueryConstraint[] = programId ? [where('program_id', '==', programId)] : []
    return getCollection<Cohort>('cohorts', ...constraints, orderBy('start_date', 'desc'))
}

export const fetchCompanies = (filters?: { programId?: string; cohortId?: string; status?: string }) => {
    const constraints: QueryConstraint[] = []
    if (filters?.programId) constraints.push(where('program_id', '==', filters.programId))
    if (filters?.cohortId) constraints.push(where('cohort_id', '==', filters.cohortId))
    if (filters?.status && filters.status !== 'all') constraints.push(where('bz_approval', '==', filters.status))
    return getCollection<Company>('companies', ...constraints, orderBy('createdDate', 'desc'))
}

export const fetchDealStages = (cohortId: string) =>
    getCollection<DealStage>('deal_stages', where('cohort_id', '==', cohortId), orderBy('sequence'))

export const fetchEvalCriteria = (cohortId: string, round?: number) => {
    const constraints = [where('cohort_id', '==', cohortId)]
    if (round) constraints.push(where('round', '==', round))
    return getCollection<EvalCriteria>('eval_criteria', ...constraints)
}

export const fetchCompanyAvgScores = (cohortId: string, round?: number) => {
    const constraints = [where('cohort_id', '==', cohortId)]
    if (round) constraints.push(where('round', '==', round))
    return getCollection<CompanyAvgScore>('company_avg_scores', ...constraints, orderBy('avg_score', 'desc'))
}

export const fetchAsks = (filters?: { programId?: string; companyId?: string; status?: string }) => {
    const constraints: QueryConstraint[] = []
    if (filters?.programId) constraints.push(where('program_id', '==', filters.programId))
    if (filters?.companyId) constraints.push(where('company_id', '==', filters.companyId))
    if (filters?.status) constraints.push(where('status', '==', filters.status))
    return getCollection<Ask>('asks', ...constraints, orderBy('due_date'))
}

export const fetchUsers = () => getCollection<AppUser>('users')
