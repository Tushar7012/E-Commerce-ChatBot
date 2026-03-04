import { X, Minus, Bot } from 'lucide-react'

interface ChatHeaderProps {
  onClose: () => void
  onMinimize?: () => void
}

export function ChatHeader({ onClose, onMinimize }: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-brand-600 to-purple-700 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">TechGear Support</h3>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-xs">AI Agent · Online</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <Minus className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
