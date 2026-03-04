import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatDate, truncate } from '@/lib/utils'
import type { ConversationRecord, DbMessage } from '@/types'
import { UserCircle, CheckCircle, AlertTriangle } from 'lucide-react'

interface ConversationDetailProps {
  conversation: ConversationRecord
  onStatusUpdate: (id: string, status: 'active' | 'resolved' | 'escalated') => Promise<void>
}

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  active: 'info',
  resolved: 'success',
  escalated: 'danger',
}

export function ConversationDetail({ conversation, onStatusUpdate }: ConversationDetailProps) {
  const [messages, setMessages] = useState<DbMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })
      setMessages((data as DbMessage[]) ?? [])
      setLoading(false)
    }
    fetchMessages()

    // Realtime
    const channel = supabase
      .channel(`detail-${conversation.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversation.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as DbMessage])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversation.id])

  const handleStatusUpdate = async (status: 'active' | 'resolved' | 'escalated') => {
    setUpdating(true)
    await onStatusUpdate(conversation.id, status)
    setUpdating(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {conversation.customer_name ?? 'Anonymous'}
              </p>
              <p className="text-xs text-gray-400">
                {conversation.customer_email ?? 'No email'} · {formatDate(conversation.created_at)}
              </p>
            </div>
          </div>
          <Badge variant={STATUS_BADGE[conversation.status] ?? 'default'}>
            {conversation.status}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          {conversation.status !== 'resolved' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleStatusUpdate('resolved')}
              loading={updating}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark Resolved
            </Button>
          )}
          {conversation.status !== 'escalated' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate('escalated')}
              loading={updating}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Escalate
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-brand-500 text-white rounded-br-sm'
                    : msg.role === 'assistant'
                    ? 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                    : 'bg-gray-200 text-gray-600 text-xs italic mx-auto'
                }`}
              >
                <p className="leading-relaxed">{truncate(msg.content, 300)}</p>
                <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                  {formatDate(msg.created_at)}
                </p>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-400">No messages yet</p>
          )}
        </div>
      )}
    </div>
  )
}
