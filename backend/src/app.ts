import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { env } from './config/env'
import chatRoutes from './routes/chat.routes'
import knowledgeRoutes from './routes/knowledge.routes'
import productsRoutes from './routes/products.routes'
import ordersRoutes from './routes/orders.routes'
import analyticsRoutes from './routes/analytics.routes'
import { errorHandler } from './middleware/error.middleware'

const app = express()

// Security
app.use(helmet({
  contentSecurityPolicy: false, // allow Vite assets
}))

// CORS – only needed in local dev; in prod frontend & backend share the same origin
if (env.nodeEnv !== 'production') {
  app.use(cors({
    origin: env.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
}

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

// ─── Serve React frontend (production) ─────────────────────────────────────
// The Vite build output lives at frontend/dist relative to the repo root.
// __dirname here = backend/dist/  →  go up two levels to reach the repo root.
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist')
app.use(express.static(frontendDist))

// Catch-all: return index.html so React Router handles client-side navigation
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})
// ────────────────────────────────────────────────────────────────────────────

// Error handling (must come after routes)
app.use(errorHandler)

export default app
