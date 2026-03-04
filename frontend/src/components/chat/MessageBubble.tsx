import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { formatDate } from '@/lib/utils'
import { ProductCard } from './ProductCard'
import { OrderCard } from './OrderCard'
import { QuickReplies } from './QuickReplies'
import { SystemMessage } from './SystemMessage'
import type { Message } from '@/types'
import { CheckCheck, AlertCircle } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  onQuickReply: (option: string) => void
}

export function MessageBubble({ message, onQuickReply }: MessageBubbleProps) {
  if (message.messageType === 'system') {
    return <SystemMessage content={message.content} />
  }

  const isUser = message.role === 'user'

  return (
    <div className={`flex items-end gap-2 animate-slide-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm">
          AI
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {/* Text content */}
        {message.content && (
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isUser
                ? 'bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
            }`}
          >
            {message.messageType === 'markdown' || message.messageType === 'text' ? (
              <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        )}

        {/* Rich content based on message type */}
        {message.messageType === 'product_card' && message.metadata.product && (
          <ProductCard product={message.metadata.product} />
        )}

        {message.messageType === 'order_card' && message.metadata.order && (
          <OrderCard order={message.metadata.order} />
        )}

        {message.messageType === 'quick_replies' && message.metadata.options && !isUser && (
          <QuickReplies options={message.metadata.options} onSelect={onQuickReply} />
        )}

        {/* Timestamp + status */}
        <div className={`flex items-center gap-1 text-xs text-gray-400 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span>{formatDate(message.createdAt)}</span>
          {isUser && (
            <>
              {message.status === 'sending' && <span className="text-gray-300">•</span>}
              {message.status === 'sent' && <CheckCheck className="w-3 h-3 text-brand-400" />}
              {message.status === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
