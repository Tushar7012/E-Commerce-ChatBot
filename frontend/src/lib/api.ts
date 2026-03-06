import axios from 'axios'
import { supabase } from './supabase'
import type {
  ApiResponse,
  SendMessageResponse,
  Product,
  Order,
  KnowledgeArticle,
  AnalyticsStats,
  DailyVolume,
  TopicCount,
  DbMessage,
} from '@/types'

const api = axios.create({
  // In production, frontend is served from Express on the same origin,
  // so we use a relative baseURL ('') — no env var needed.
  // In local dev, set VITE_API_BASE_URL=http://localhost:3001 in frontend/.env
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 30000,
})

// Attach Supabase JWT for admin routes
api.interceptors.request.use(async (config) => {
  if (
    config.url?.includes('/analytics') ||
    config.url?.includes('/knowledge')
  ) {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
  }
  return config
})

// ============ CHAT ============

export const chatApi = {
  sendMessage: (payload: {
    sessionId: string
    message: string
    customerName?: string
    customerEmail?: string
    metadata?: Record<string, unknown>
  }) => api.post<ApiResponse<SendMessageResponse>>('/api/chat/message', payload),

  getMessages: (conversationId: string) =>
    api.get<ApiResponse<DbMessage[]>>(`/api/chat/conversation/${conversationId}`),
}

// ============ PRODUCTS ============

export const productsApi = {
  list: (params?: { q?: string; category?: string }) =>
    api.get<ApiResponse<Product[]>>('/api/products', { params }),
  get: (id: string) =>
    api.get<ApiResponse<Product>>(`/api/products/${id}`),
}

// ============ ORDERS ============

export const ordersApi = {
  get: (orderNumber: string) =>
    api.get<ApiResponse<Order>>(`/api/orders/${orderNumber}`),
  list: () =>
    api.get<ApiResponse<Order[]>>('/api/orders'),
}

// ============ KNOWLEDGE BASE ============

export const knowledgeApi = {
  list: (params?: { category?: string; search?: string }) =>
    api.get<ApiResponse<KnowledgeArticle[]>>('/api/knowledge', { params }),
  create: (article: Omit<KnowledgeArticle, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<ApiResponse<KnowledgeArticle>>('/api/knowledge', article),
  update: (id: string, article: Partial<KnowledgeArticle>) =>
    api.put<ApiResponse<KnowledgeArticle>>(`/api/knowledge/${id}`, article),
  delete: (id: string) =>
    api.delete<ApiResponse<{ deleted: boolean }>>(`/api/knowledge/${id}`),
}

// ============ ANALYTICS ============

export const analyticsApi = {
  getStats: () => api.get<ApiResponse<AnalyticsStats>>('/api/analytics/stats'),
  getDailyVolume: (days: number) =>
    api.get<ApiResponse<DailyVolume[]>>(`/api/analytics/volume?days=${days}`),
  getTopTopics: () =>
    api.get<ApiResponse<TopicCount[]>>('/api/analytics/topics'),
}
