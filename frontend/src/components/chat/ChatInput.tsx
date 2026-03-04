import { useState, useRef, type KeyboardEvent } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled = false, placeholder = 'Type your message...' }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  return (
    <div className="p-4 border-t border-gray-100 bg-white">
      <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all px-4 py-2">
        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mb-1">
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          maxLength={2000}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 py-1.5 min-h-[36px] max-h-[120px] disabled:opacity-50"
        />

        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 mb-0.5',
            value.trim() && !disabled
              ? 'bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-sm hover:shadow-md hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
