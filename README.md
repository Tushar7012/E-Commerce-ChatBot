# TechGear AI Support Platform

Enterprise-grade AI customer support chatbot built for portfolio demonstration. Showcases full-stack architecture with real AI, real-time features, and production patterns.

## Features

- **AI Chat** — Claude-powered conversations with product cards, order tracking, quick replies
- **RAG System** — Supabase full-text search retrieves relevant knowledge articles for accurate answers
- **Admin Dashboard** — Real-time conversation monitoring, analytics charts, knowledge base CRUD
- **Supabase Auth** — Secure admin login with JWT
- **Supabase Realtime** — Live conversation updates without polling
- **Multi-message types** — Text/markdown, product cards, order timelines, quick reply chips

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS (Vite) |
| Backend | Express.js + TypeScript (ts-node) |
| Database | Supabase (PostgreSQL + Auth + Realtime) |
| AI | Claude API (`claude-sonnet-4-6`) |
| State | Zustand + TanStack React Query |
| Charts | Recharts |

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase project ([supabase.com](https://supabase.com))
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### 1. Clone and install

```bash
cd techgear-ai-support
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire contents of `supabase/schema.sql`
   - This creates tables, RLS policies, enables Realtime, and seeds 10 knowledge articles
3. Create an admin user: **Authentication > Users > Add user**

### 3. Configure environment

Copy `.env.example` to `.env` in both `frontend/` and `backend/`:

**`backend/.env`**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-6
PORT=3001
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20
NODE_ENV=development
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run

```bash
# From root directory
npm run dev
```

- Customer chat: http://localhost:5173
- Admin dashboard: http://localhost:5173/admin
- Backend API: http://localhost:3001/health

## Demo Script

For impressing clients:

1. **Customer chat** → type: `"I need to return my headphones"` → Claude answers using KB
2. Type: `"Show me your best headphones"` → product card appears
3. Type: `"Track order ORD-2024-8847"` → order timeline appears
4. Open `/admin` → see conversation appear in real-time
5. **Analytics** → charts with live data
6. **Knowledge Base** → edit the return policy → re-ask in chat → updated answer

## Architecture

```
Frontend (Vite :5173)
  └── React Router
       ├── / → CustomerPage (store + chat widget)
       └── /admin → AdminRoot (auth guard)
            └── AdminLayout (sidebar)
                 ├── /admin → DashboardPage
                 ├── /admin/conversations → ConversationsPage
                 ├── /admin/knowledge → KnowledgePage
                 └── /admin/analytics → AnalyticsPage

Backend (Express :3001)
  └── POST /api/chat/message    → RAG search → Claude → save → response
  └── GET  /api/products        → seed data
  └── GET  /api/orders/:num     → seed data
  └── CRUD /api/knowledge       → Supabase CRUD (auth protected)
  └── GET  /api/analytics/*     → Supabase queries (auth protected)

Supabase
  ├── conversations             → sessions
  ├── messages                  → chat history (Realtime enabled)
  ├── knowledge_articles        → RAG source (FTS index)
  └── analytics_events          → event tracking
```

## RAG System

The chatbot uses **Retrieval-Augmented Generation** via Supabase PostgreSQL full-text search:

1. User sends a message
2. Backend queries `knowledge_articles` using `tsvector` FTS with websearch syntax
3. Top 3 articles are formatted into a context block
4. Context is injected into Claude's system prompt
5. Claude answers based on retrieved knowledge — no hallucinations

**Production upgrade path:** The schema already includes an `embedding VECTOR(1536)` column. To enable semantic search, generate embeddings with OpenAI/Voyage AI and use `ORDER BY embedding <=> $query_vector LIMIT 3`.

## Action Token System

Claude appends structured tokens to indicate rich UI responses:

| Token | Component rendered |
|---|---|
| `[ACTION:SHOW_PRODUCT:prod_001]` | ProductCard with image, price, CTA |
| `[ACTION:SHOW_ORDER:ORD-2024-8847]` | OrderCard with timeline |
| `[ACTION:QUICK_REPLIES:["A","B"]]` | Clickable pill buttons |

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Add Sentry DSN for error monitoring
- [ ] Enable pgvector + embedding pipeline
- [ ] Set up Redis (Upstash) for rate limiting at scale
- [ ] Add GitHub Actions CI/CD (`.github/workflows/`)
- [ ] Deploy frontend to Vercel, backend to Railway/Render
- [ ] Configure custom domain + SSL
- [ ] Add multi-tenant support (tenant_id on all tables)
