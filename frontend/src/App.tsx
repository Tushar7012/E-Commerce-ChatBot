import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CustomerPage } from './pages/CustomerPage'
import { AdminRoot } from './pages/AdminRoot'
import { AdminLayout } from './components/admin/AdminLayout'
import { DashboardPage } from './components/admin/DashboardPage'
import { ConversationsPage } from './components/admin/ConversationsPage'
import { KnowledgePage } from './components/admin/KnowledgePage'
import { AnalyticsPage } from './components/admin/AnalyticsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Customer-facing store */}
          <Route path="/" element={<CustomerPage />} />

          {/* Admin dashboard (auth-gated) */}
          <Route path="/admin" element={<AdminRoot />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="conversations" element={<ConversationsPage />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
