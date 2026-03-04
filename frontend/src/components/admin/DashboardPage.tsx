import { MessageSquare, CheckCircle, Users, Zap, Clock, Star } from 'lucide-react'
import { StatsCard } from './StatsCard'
import { VolumeChart } from './VolumeChart'
import { SentimentChart } from './SentimentChart'
import { TopicsChart } from './TopicsChart'
import { useAnalyticsStats } from '@/hooks/useAnalytics'
import { Spinner } from '@/components/ui/Spinner'

export function DashboardPage() {
  const { data: stats, isLoading } = useAnalyticsStats()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">AI Support overview · Real-time</p>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          <StatsCard
            title="Total Conversations"
            value={stats?.totalConversations ?? 0}
            subtitle="All time"
            icon={MessageSquare}
            trend={{ value: 12, label: 'vs last week' }}
            color="blue"
          />
          <StatsCard
            title="Active Now"
            value={stats?.activeConversations ?? 0}
            subtitle="Live conversations"
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Resolved Today"
            value={stats?.resolvedToday ?? 0}
            subtitle="Closed this session"
            icon={CheckCircle}
            trend={{ value: 8, label: 'vs yesterday' }}
            color="purple"
          />
          <StatsCard
            title="Avg Response Time"
            value={stats?.avgResponseTime ?? '—'}
            subtitle="Claude API"
            icon={Zap}
            color="indigo"
          />
          <StatsCard
            title="Resolution Rate"
            value={`${stats?.resolutionRate ?? 0}%`}
            subtitle="AI automated"
            icon={Clock}
            trend={{ value: 3, label: 'vs last month' }}
            color="orange"
          />
          <StatsCard
            title="CSAT Score"
            value={`${stats?.satisfactionScore ?? 0}/5`}
            subtitle="Customer satisfaction"
            icon={Star}
            trend={{ value: 5, label: 'vs last month' }}
            color="green"
          />
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <div className="xl:col-span-2">
          <VolumeChart />
        </div>
        <SentimentChart />
      </div>

      {/* Charts row 2 */}
      <TopicsChart />
    </div>
  )
}
