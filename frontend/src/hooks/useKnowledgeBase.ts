import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { knowledgeApi } from '@/lib/api'
import type { KnowledgeArticle } from '@/types'

export function useKnowledgeBase(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['knowledge', params],
    queryFn: async () => {
      const res = await knowledgeApi.list(params)
      return res.data.data ?? []
    },
    staleTime: 30000,
  })
}

export function useCreateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (article: Omit<KnowledgeArticle, 'id' | 'created_at' | 'updated_at'>) =>
      knowledgeApi.create(article),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['knowledge'] }),
  })
}

export function useUpdateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<KnowledgeArticle> & { id: string }) =>
      knowledgeApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['knowledge'] }),
  })
}

export function useDeleteArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => knowledgeApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['knowledge'] }),
  })
}
