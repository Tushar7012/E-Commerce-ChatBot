import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ConversationRecord } from '@/types'

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('conversations')
      .select(`
        *,
        messages(id, content, created_at, role)
      `)
      .order('updated_at', { ascending: false })
      .limit(50)

    if (err) {
      setError(err.message)
    } else {
      const enriched = (data ?? []).map((c) => ({
        ...c,
        messageCount: c.messages?.length ?? 0,
        lastMessage: c.messages?.[c.messages.length - 1]?.content ?? '',
      }))
      setConversations(enriched as ConversationRecord[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchConversations()

    // Realtime: update conversation list when messages/conversations change
    const channel = supabase
      .channel('admin-conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        fetchConversations()
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchConversations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchConversations])

  const updateStatus = async (id: string, status: 'active' | 'resolved' | 'escalated') => {
    await supabase
      .from('conversations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
  }

  return { conversations, loading, error, refetch: fetchConversations, updateStatus }
}
