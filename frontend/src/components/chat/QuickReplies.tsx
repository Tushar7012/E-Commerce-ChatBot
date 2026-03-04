interface QuickRepliesProps {
  options: string[]
  onSelect: (option: string) => void
}

export function QuickReplies({ options, onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 animate-slide-in">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className="px-4 py-2 text-sm border-2 border-brand-500 text-brand-600 rounded-full hover:bg-brand-500 hover:text-white transition-all duration-150 font-medium"
        >
          {option}
        </button>
      ))}
    </div>
  )
}
