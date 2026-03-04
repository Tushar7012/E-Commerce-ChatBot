import { supabase } from '../config/supabase'

export interface MessageRecord {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  message_type: string
  metadata: Record<string, unknown>
  created_at: string
}

/**
 * Save a message to the database.
 */
export async function saveMessage(params: {
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  messageType?: string
  metadata?: Record<string, unknown>
}): Promise<MessageRecord> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: params.conversationId,
      role: params.role,
      content: params.content,
      message_type: params.messageType ?? 'text',
      metadata: params.metadata ?? {},
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to save message: ${error.message}`)
  return data as MessageRecord
}

/**
 * Load recent conversation history (last N messages) for Claude context.
 */
export async function getHistory(
  conversationId: string,
  limit = 20
): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .in('role', ['user', 'assistant'])
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  // Reverse to chronological order
  return (data as { role: 'user' | 'assistant'; content: string }[]).reverse()
}

/**
 * Get paginated messages for admin conversation detail view.
 */
export async function getConversationMessages(
  conversationId: string
): Promise<MessageRecord[]> {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  return (data as MessageRecord[]) ?? []
}
