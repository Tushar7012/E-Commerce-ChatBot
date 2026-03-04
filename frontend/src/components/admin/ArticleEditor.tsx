import { useState, type FormEvent, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useCreateArticle, useUpdateArticle } from '@/hooks/useKnowledgeBase'
import type { KnowledgeArticle } from '@/types'

interface ArticleEditorProps {
  open: boolean
  onClose: () => void
  article?: KnowledgeArticle | null
}

const CATEGORIES = ['general', 'returns', 'shipping', 'warranty', 'technical', 'orders', 'account', 'payment', 'products']

export function ArticleEditor({ open, onClose, article }: ArticleEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [tags, setTags] = useState('')
  const [isActive, setIsActive] = useState(true)

  const createMutation = useCreateArticle()
  const updateMutation = useUpdateArticle()

  const isEditing = !!article
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (article) {
      setTitle(article.title)
      setContent(article.content)
      setCategory(article.category)
      setTags(article.tags.join(', '))
      setIsActive(article.is_active)
    } else {
      setTitle('')
      setContent('')
      setCategory('general')
      setTags('')
      setIsActive(true)
    }
  }, [article, open])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const data = {
      title,
      content,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      is_active: isActive,
    }

    if (isEditing && article) {
      await updateMutation.mutateAsync({ id: article.id, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit Article' : 'New Article'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="e.g. Return & Refund Policy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
            <span className="text-gray-400 font-normal ml-2">({content.length} chars)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            placeholder="Write the knowledge article content here. This will be retrieved by the AI when answering related questions..."
          />
          <p className="text-xs text-gray-400 mt-1">Tip: 200-800 characters works best for RAG retrieval</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            placeholder="returns, refund, policy"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-brand-500 rounded"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active (used in AI responses)</label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isPending} className="flex-1">
            {isEditing ? 'Update Article' : 'Create Article'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
