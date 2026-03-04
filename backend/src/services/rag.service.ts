import { supabase } from '../config/supabase'

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
}

/**
 * Retrieve relevant knowledge articles using Supabase full-text search.
 * Falls back to ilike search for short queries.
 * In production: replace with pgvector embedding similarity search.
 */
export async function searchKnowledge(query: string, limit = 3): Promise<KnowledgeArticle[]> {
  if (!query.trim()) return []

  // Try full-text search first
  const { data: ftsResults, error: ftsError } = await supabase
    .from('knowledge_articles')
    .select('id, title, content, category, tags')
    .textSearch('fts_vector', query, { type: 'websearch', config: 'english' })
    .eq('is_active', true)
    .limit(limit)

  if (!ftsError && ftsResults && ftsResults.length > 0) {
    return ftsResults as KnowledgeArticle[]
  }

  // Fallback: title contains query
  const { data: fallback } = await supabase
    .from('knowledge_articles')
    .select('id, title, content, category, tags')
    .ilike('title', `%${query.split(' ').slice(0, 2).join('%')}%`)
    .eq('is_active', true)
    .limit(limit)

  return (fallback as KnowledgeArticle[]) ?? []
}

/**
 * Format retrieved articles into a context block for the Claude system prompt.
 */
export function formatContext(articles: KnowledgeArticle[]): string {
  if (!articles.length) {
    return 'No specific knowledge articles found for this query. Use your general knowledge about TechGear products and policies.'
  }

  return articles
    .map((a, i) => `[KB Article ${i + 1}: ${a.title}]\n${a.content}`)
    .join('\n\n---\n\n')
}
