import { useQuery } from '@tanstack/react-query'
import { fetchPrograms, getDocument } from '@/lib/firestore'
import { Program } from '@/types'

export function usePrograms() {
    return useQuery({
        queryKey: ['programs'],
        queryFn: () => fetchPrograms(),
    })
}

export function useProgram(id: string) {
    return useQuery({
        queryKey: ['program', id],
        queryFn: () => getDocument<Program>('programs', id),
        enabled: !!id,
    })
}
