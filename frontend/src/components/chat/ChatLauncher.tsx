import { MessageCircle, X } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'

export function ChatLauncher() {
  const { isOpen, setOpen, messages } = useChat()

  const unread = isOpen ? 0 : messages.filter(m => m.role === 'assistant' && m.status === 'sent').length

  return (
    <button
      onClick={() => setOpen(!isOpen)}
      className={cn(
        'fixed bottom-6 right-6 z-40 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 animate-pulse-glow',
        'bg-gradient-to-br from-brand-500 to-purple-600 text-white hover:scale-105 active:scale-95',
        isOpen && 'z-30'
      )}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <div className="relative">
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        {!isOpen && unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </div>
    </button>
  )
}
