import { useQuery } from '@tanstack/react-query'
import { fetchCompanies, getDocument } from '@/lib/firestore'
import { Company } from '@/types'

export function useCompanies(filters?: { programId?: string; cohortId?: string; status?: string }) {
    return useQuery({
        queryKey: ['companies', filters],
        queryFn: () => fetchCompanies(filters),
    })
}

export function useCompany(id: string) {
    return useQuery({
        queryKey: ['company', id],
        queryFn: () => getDocument<Company>('companies', id),
        enabled: !!id,
    })
}
