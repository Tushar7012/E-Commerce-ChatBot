import { Router } from 'express'
import { getOrder, listOrders } from '../controllers/orders.controller'

const router = Router()

router.get('/', listOrders)
router.get('/:orderNumber', getOrder)

export default router
