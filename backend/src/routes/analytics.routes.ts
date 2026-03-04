import { Router } from 'express'
import { getStats, getDailyVolume, getTopTopics } from '../controllers/analytics.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.get('/stats', requireAuth, getStats)
router.get('/volume', requireAuth, getDailyVolume)
router.get('/topics', requireAuth, getTopTopics)

export default router
