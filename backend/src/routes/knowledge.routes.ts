import { Router } from 'express'
import { listArticles, createArticle, updateArticle, deleteArticle } from '../controllers/knowledge.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.get('/', listArticles)
router.post('/', requireAuth, createArticle)
router.put('/:id', requireAuth, updateArticle)
router.delete('/:id', requireAuth, deleteArticle)

export default router
