import { Request, Response } from 'express'
import { PRODUCTS, searchProducts } from '../data/products.seed'

export function listProducts(req: Request, res: Response): void {
  const { q, category } = req.query as { q?: string; category?: string }

  let results = PRODUCTS
  if (q) results = searchProducts(q)
  if (category) results = results.filter(p => p.category === category)

  res.json({ success: true, data: results })
}

export function getProduct(req: Request, res: Response): void {
  const product = PRODUCTS.find(p => p.id === req.params.id)
  if (!product) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } })
    return
  }
  res.json({ success: true, data: product })
}
