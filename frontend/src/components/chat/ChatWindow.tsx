import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { useChat } from '@/hooks/useChat'

export function ChatWindow() {
  const { messages, isTyping, isOpen, setOpen, sendMessage } = useChat()

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] flex flex-col bg-gray-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-in">
      <ChatHeader onClose={() => setOpen(false)} />
      <MessageList
        messages={messages}
        isTyping={isTyping}
        onQuickReply={sendMessage}
      />
      <ChatInput
        onSend={sendMessage}
        disabled={isTyping}
        placeholder="Ask me anything about TechGear..."
      />
    </div>
  )
}
