import { Request, Response } from 'express'
import { ORDERS, getOrderByNumber } from '../data/orders.seed'

export function getOrder(req: Request, res: Response): void {
  const order = getOrderByNumber(req.params.orderNumber)
  if (!order) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } })
    return
  }
  res.json({ success: true, data: order })
}

export function listOrders(_req: Request, res: Response): void {
  res.json({ success: true, data: ORDERS })
}
