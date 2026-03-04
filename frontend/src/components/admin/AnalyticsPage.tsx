import { VolumeChart } from './VolumeChart'
import { SentimentChart } from './SentimentChart'
import { TopicsChart } from './TopicsChart'
import { useAnalyticsStats } from '@/hooks/useAnalytics'
import { Spinner } from '@/components/ui/Spinner'

export function AnalyticsPage() {
  const { data: stats, isLoading } = useAnalyticsStats()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Performance metrics and conversation insights</p>
      </div>

      {/* Summary row */}
      {isLoading ? (
        <div className="flex items-center justify-center h-20">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Resolution Rate', value: `${stats?.resolutionRate}%`, color: 'text-green-600' },
            { label: 'Escalation Rate', value: `${stats?.escalationRate}%`, color: 'text-red-500' },
            { label: 'Avg Response', value: stats?.avgResponseTime ?? '—', color: 'text-brand-600' },
            { label: 'CSAT Score', value: `${stats?.satisfactionScore}/5`, color: 'text-yellow-600' },
          ].map((metric) => (
            <div key={metric.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{metric.label}</p>
              <p className={`text-3xl font-bold mt-1 ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <VolumeChart />
          </div>
          <SentimentChart />
        </div>
        <TopicsChart />
      </div>

      {/* Info note */}
      <div className="mt-6 bg-brand-50 border border-brand-200 rounded-2xl p-4 text-sm text-brand-700">
        <strong>Production upgrade:</strong> Add intent classification per message (second Claude call) to get real sentiment tracking.
        The sentiment chart above shows illustrative data; volume and topic charts show real data from the database.
      </div>
    </div>
  )
}
