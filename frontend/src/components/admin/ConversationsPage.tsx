import { useState } from 'react'
import { Search, MessageSquare, Circle } from 'lucide-react'
import { useConversations } from '@/hooks/useConversations'
import { ConversationDetail } from './ConversationDetail'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate, truncate } from '@/lib/utils'
import type { ConversationRecord } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  active: 'info',
  resolved: 'success',
  escalated: 'danger',
}

export function ConversationsPage() {
  const { conversations, loading, updateStatus } = useConversations()
  const [selected, setSelected] = useState<ConversationRecord | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = conversations.filter((c) => {
    const matchesSearch =
      !search ||
      c.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_email?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex h-screen">
      {/* List panel */}
      <div className="w-80 border-r border-gray-100 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Conversations</h1>
          <p className="text-xs text-gray-400 mt-0.5">{conversations.length} total</p>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {/* Status filters */}
          <div className="flex gap-1.5 mt-3">
            {['all', 'active', 'resolved', 'escalated'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all',
                  statusFilter === s
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Spinner />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <MessageSquare className="w-8 h-8 text-gray-200" />
              <p className="text-sm text-gray-400">No conversations</p>
            </div>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv)}
                className={cn(
                  'w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors',
                  selected?.id === conv.id && 'bg-brand-50 border-l-2 border-l-brand-500'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {conv.customer_name ?? 'Anonymous'}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(conv.updated_at)}</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                  {truncate(conv.lastMessage ?? 'No messages', 60)}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant={STATUS_BADGE[conv.status] ?? 'default'}>{conv.status}</Badge>
                  {(conv.messageCount ?? 0) > 0 && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Circle className="w-2.5 h-2.5 fill-current" />
                      {conv.messageCount ?? 0}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 bg-gray-50">
        {selected ? (
          <ConversationDetail
            conversation={selected}
            onStatusUpdate={async (id, status) => {
              await updateStatus(id, status)
              setSelected(prev => prev ? { ...prev, status } : null)
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <MessageSquare className="w-12 h-12 text-gray-200" />
            <p className="text-sm">Select a conversation to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
