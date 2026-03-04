import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getOrCreateSessionId } from '@/lib/utils'
import type { Message, MessageType, MessageMetadata } from '@/types'

interface ChatStore {
  // Persistent
  sessionId: string
  customerName: string

  // Session state
  conversationId: string | null
  messages: Message[]
  isTyping: boolean
  isOpen: boolean

  // Actions
  setOpen: (open: boolean) => void
  setConversationId: (id: string) => void
  setCustomerName: (name: string) => void
  addMessage: (msg: Message) => void
  addOptimisticMessage: (content: string) => string
  resolveOptimisticMessage: (tempId: string, real: {
    content: string
    messageType: MessageType
    metadata: MessageMetadata
  }) => void
  setTyping: (typing: boolean) => void
  clearMessages: () => void
  initMessages: (msgs: Message[]) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessionId: getOrCreateSessionId(),
      customerName: '',
      conversationId: null,
      messages: [],
      isTyping: false,
      isOpen: false,

      setOpen: (open) => set({ isOpen: open }),

      setConversationId: (id) => set({ conversationId: id }),

      setCustomerName: (name) => set({ customerName: name }),

      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),

      addOptimisticMessage: (content) => {
        const tempId = `temp_${Date.now()}`
        const msg: Message = {
          id: tempId,
          conversationId: get().conversationId ?? '',
          role: 'user',
          content,
          messageType: 'text',
          metadata: {},
          createdAt: new Date().toISOString(),
          status: 'sending',
        }
        set((state) => ({ messages: [...state.messages, msg] }))
        return tempId
      },

      resolveOptimisticMessage: (tempId, real) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === tempId ? { ...m, status: 'sent' as const } : m
          ),
        }))

        // Add the AI response
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          conversationId: get().conversationId ?? '',
          role: 'assistant',
          content: real.content,
          messageType: real.messageType,
          metadata: real.metadata,
          createdAt: new Date().toISOString(),
          status: 'sent',
        }
        set((state) => ({ messages: [...state.messages, aiMsg] }))
      },

      setTyping: (typing) => set({ isTyping: typing }),

      clearMessages: () => set({ messages: [], conversationId: null }),

      initMessages: (msgs) => set({ messages: msgs }),
    }),
    {
      name: 'techgear-chat',
      partialize: (state) => ({
        sessionId: state.sessionId,
        customerName: state.customerName,
      }),
    }
  )
)
