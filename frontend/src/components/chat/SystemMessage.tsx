interface SystemMessageProps {
  content: string
}

export function SystemMessage({ content }: SystemMessageProps) {
  return (
    <div className="flex justify-center my-2 animate-fade-in">
      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
        {content}
      </span>
    </div>
  )
}
