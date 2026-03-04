import rateLimit from 'express-rate-limit'
import { env } from '../config/env'

export const chatRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many messages. Please wait a moment before sending another.',
    },
  },
})
