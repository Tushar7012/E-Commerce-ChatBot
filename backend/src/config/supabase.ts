import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Service-role client — full DB access, never expose to frontend
export const supabase = createClient(
  env.supabase.url,
  env.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
