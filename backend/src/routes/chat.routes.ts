import { Router } from 'express'
import { sendMessage, getConversation } from '../controllers/chat.controller'
import { chatRateLimit } from '../middleware/rateLimit.middleware'

const router = Router()

router.post('/message', chatRateLimit, sendMessage)
router.get('/conversation/:conversationId', getConversation)

export default router
