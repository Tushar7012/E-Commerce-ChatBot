import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import chatRoutes from './routes/chat.routes'
import knowledgeRoutes from './routes/knowledge.routes'
import productsRoutes from './routes/products.routes'
import ordersRoutes from './routes/orders.routes'
import analyticsRoutes from './routes/analytics.routes'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'

const app = express()

// Security
app.use(helmet())
app.use(cors({
  origin: env.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Body parsing
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/chat', chatRoutes)
app.use('/api/knowledge', knowledgeRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/analytics', analyticsRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

export default app
