import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, ToggleLeft, BookOpen } from 'lucide-react'
import { useKnowledgeBase, useDeleteArticle, useUpdateArticle } from '@/hooks/useKnowledgeBase'
import { ArticleEditor } from './ArticleEditor'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { formatDate, truncate } from '@/lib/utils'
import type { KnowledgeArticle } from '@/types'

const CATEGORIES = ['all', 'returns', 'shipping', 'warranty', 'technical', 'orders', 'account', 'payment', 'products', 'general']

export function KnowledgePage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null)

  const { data: articles, isLoading } = useKnowledgeBase({
    search: search || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  })

  const deleteMutation = useDeleteArticle()
  const updateMutation = useUpdateArticle()

  const handleEdit = (article: KnowledgeArticle) => {
    setEditingArticle(article)
    setEditorOpen(true)
  }

  const handleNew = () => {
    setEditingArticle(null)
    setEditorOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this article? This cannot be undone.')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const handleToggle = async (article: KnowledgeArticle) => {
    await updateMutation.mutateAsync({ id: article.id, is_active: !article.is_active })
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">RAG source · {articles?.length ?? 0} articles</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4" />
          New Article
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner />
          </div>
        ) : !articles?.length ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <BookOpen className="w-10 h-10 text-gray-200" />
            <p className="text-sm">No articles found. Create one to get started.</p>
            <Button size="sm" onClick={handleNew}>
              <Plus className="w-3.5 h-3.5" /> Create First Article
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Content</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Updated</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{article.title}</p>
                    {article.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="info" className="capitalize">{article.category}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-gray-400 text-xs">{truncate(article.content, 80)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={article.is_active ? 'success' : 'default'}>
                      {article.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">
                    {formatDate(article.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggle(article)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-500 transition-colors"
                        title={article.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <ToggleLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ArticleEditor
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditingArticle(null) }}
        article={editingArticle}
      />
    </div>
  )
}
