import { useQuery } from '@tanstack/react-query'
import { fetchAsks } from '@/lib/firestore'

export function useAsks(filters?: { programId?: string; companyId?: string; status?: string }) {
    return useQuery({
        queryKey: ['asks', filters],
        queryFn: () => fetchAsks(filters),
    })
}
