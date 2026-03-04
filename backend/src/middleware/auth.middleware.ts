import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env'

// Anon client for JWT verification only
const supabaseAnon = createClient(env.supabase.url, env.supabase.serviceRoleKey)

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing authorization header' } })
    return
  }

  const token = authHeader.slice(7)

  const { data: { user }, error } = await supabaseAnon.auth.getUser(token)

  if (error || !user) {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } })
    return
  }

  req.user = {
    id: user.id,
    email: user.email ?? '',
    role: user.role ?? 'authenticated',
  }

  next()
}
