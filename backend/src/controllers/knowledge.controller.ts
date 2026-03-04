import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { supabase } from '../config/supabase'

const articleSchema = z.object({
  title: z.string().min(3).max(300),
  content: z.string().min(10).max(5000),
  category: z.string().min(1).max(100),
  tags: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
})

export async function listArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search } = req.query as { category?: string; search?: string }

    let query = supabase
      .from('knowledge_articles')
      .select('id, title, content, category, tags, is_active, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (search) query = query.textSearch('fts_vector', search, { type: 'websearch' })

    const { data, error } = await query

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = articleSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: body.error.issues[0].message } })
      return
    }

    const { data, error } = await supabase
      .from('knowledge_articles')
      .insert(body.data)
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = articleSchema.partial().safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: body.error.issues[0].message } })
      return
    }

    const { data, error } = await supabase
      .from('knowledge_articles')
      .update({ ...body.data, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    if (!data) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Article not found' } }); return }
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { error } = await supabase
      .from('knowledge_articles')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true, data: { deleted: true } })
  } catch (err) {
    next(err)
  }
}
