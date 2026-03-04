import { supabase } from '../config/supabase'

export interface ConversationRecord {
  id: string
  session_id: string
  customer_name: string | null
  customer_email: string | null
  status: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

/**
 * Get or create a conversation for a given session ID.
 */
export async function upsertConversation(
  sessionId: string,
  customerName?: string,
  customerEmail?: string,
  metadata?: Record<string, unknown>
): Promise<ConversationRecord> {
  // Check if conversation exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('session_id', sessionId)
    .single()

  if (existing) {
    // Update name/email if provided
    if (customerName || customerEmail) {
      const { data: updated } = await supabase
        .from('conversations')
        .update({
          customer_name: customerName ?? existing.customer_name,
          customer_email: customerEmail ?? existing.customer_email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()
      return updated as ConversationRecord
    }
    return existing as ConversationRecord
  }

  // Create new conversation
  const { data: created, error } = await supabase
    .from('conversations')
    .insert({
      session_id: sessionId,
      customer_name: customerName ?? null,
      customer_email: customerEmail ?? null,
      status: 'active',
      metadata: metadata ?? {},
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create conversation: ${error.message}`)
  return created as ConversationRecord
}

/**
 * Update conversation status.
 */
export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'resolved' | 'escalated'
): Promise<void> {
  await supabase
    .from('conversations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', conversationId)
}
