import { useCallback, useEffect } from 'react'
import { chatApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { useChatStore } from '@/store/chatStore'
import type { Message, DbMessage } from '@/types'

function dbMessageToMessage(msg: DbMessage): Message {
  return {
    id: msg.id,
    conversationId: msg.conversation_id,
    role: msg.role,
    content: msg.content,
    messageType: msg.message_type,
    metadata: msg.metadata,
    createdAt: msg.created_at,
    status: 'sent',
  }
}

export function useChat() {
  const {
    sessionId,
    customerName,
    conversationId,
    messages,
    isTyping,
    isOpen,
    setOpen,
    setConversationId,
    addOptimisticMessage,
    resolveOptimisticMessage,
    setTyping,
    addMessage,
  } = useChatStore()

  // Subscribe to Supabase Realtime for this conversation (progressive enhancement)
  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incoming = payload.new as DbMessage
          // Only add if it's a new assistant message we haven't seen yet
          if (
            incoming.role === 'assistant' &&
            !messages.find((m) => m.id === incoming.id)
          ) {
            addMessage(dbMessageToMessage(incoming))
            setTyping(false)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId]) // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      const tempId = addOptimisticMessage(content)
      setTyping(true)

      try {
        const response = await chatApi.sendMessage({
          sessionId,
          message: content,
          customerName: customerName || undefined,
        })

        if (!response.data.success || !response.data.data) {
          throw new Error(response.data.error?.message ?? 'Unknown error')
        }

        const { conversationId: convId, message, messageType, metadata } = response.data.data

        if (!conversationId) {
          setConversationId(convId)
        }

        resolveOptimisticMessage(tempId, { content: message, messageType, metadata })
      } catch (err) {
        console.error('Failed to send message:', err)
        // Mark as error
        useChatStore.setState((state) => ({
          messages: state.messages.map((m) =>
            m.id === tempId ? { ...m, status: 'error' as const } : m
          ),
        }))
      } finally {
        setTyping(false)
      }
    },
    [sessionId, customerName, conversationId, addOptimisticMessage, resolveOptimisticMessage, setConversationId, setTyping]
  )

  return {
    messages,
    isTyping,
    isOpen,
    setOpen,
    sendMessage,
    sessionId,
    conversationId,
  }
}
