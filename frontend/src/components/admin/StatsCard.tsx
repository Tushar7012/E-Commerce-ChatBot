import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
}

const COLORS = {
  blue:   { icon: 'bg-blue-50 text-blue-600',   border: 'border-blue-100' },
  green:  { icon: 'bg-green-50 text-green-600',  border: 'border-green-100' },
  purple: { icon: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  orange: { icon: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
  red:    { icon: 'bg-red-50 text-red-600',       border: 'border-red-100' },
  indigo: { icon: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color = 'blue' }: StatsCardProps) {
  const c = COLORS[color]
  return (
    <div className={cn('bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-shadow', c.border)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.value >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', c.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
