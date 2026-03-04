import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api'

export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: async () => {
      const res = await analyticsApi.getStats()
      return res.data.data!
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useDailyVolume(days = 7) {
  return useQuery({
    queryKey: ['analytics', 'volume', days],
    queryFn: async () => {
      const res = await analyticsApi.getDailyVolume(days)
      return res.data.data!
    },
    staleTime: 60000,
    retry: 1,
  })
}

export function useTopTopics() {
  return useQuery({
    queryKey: ['analytics', 'topics'],
    queryFn: async () => {
      const res = await analyticsApi.getTopTopics()
      return res.data.data!
    },
    staleTime: 60000,
    retry: 1,
  })
}
