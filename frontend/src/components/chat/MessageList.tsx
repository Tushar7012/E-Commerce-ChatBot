import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { Spinner } from '@/components/ui/Spinner'
import type { Message } from '@/types'
import { Bot } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
  isTyping: boolean
  isLoading?: boolean
  onQuickReply: (option: string) => void
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  conversationId: '',
  role: 'assistant',
  content: `Hi! 👋 I'm TechGear's AI Support Assistant. I can help you with:

- **Order tracking** and status updates
- **Product recommendations** and comparisons
- **Returns & refunds** questions
- **Technical support** for your devices

How can I help you today?`,
  messageType: 'markdown',
  metadata: {},
  createdAt: new Date().toISOString(),
  status: 'sent',
}

export function MessageList({ messages, isTyping, isLoading = false, onQuickReply }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const allMessages = messages.length === 0 ? [WELCOME_MESSAGE] : messages

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
      {/* Bot avatar intro for empty state */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center py-4 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <p className="text-xs text-gray-400">Powered by Claude AI</p>
        </div>
      )}

      {allMessages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} onQuickReply={onQuickReply} />
      ))}

      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
