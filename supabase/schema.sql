-- ============================================================
-- TechGear AI Support - Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable pgvector (optional, for production embedding upgrade)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- ============ CONVERSATIONS ============
CREATE TABLE IF NOT EXISTS conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  customer_email TEXT,
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'resolved', 'escalated')),
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  resolved_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);

-- ============ MESSAGES ============
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content         TEXT NOT NULL,
  message_type    TEXT NOT NULL DEFAULT 'text'
                  CHECK (message_type IN ('text', 'markdown', 'product_card', 'order_card', 'quick_replies', 'system')),
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(conversation_id, role);

-- ============ KNOWLEDGE ARTICLES ============
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'general',
  tags        TEXT[] DEFAULT '{}',
  is_active   BOOLEAN DEFAULT TRUE,
  -- Full-text search vector (generated column)
  fts_vector  TSVECTOR GENERATED ALWAYS AS (
                to_tsvector('english', title || ' ' || content)
              ) STORED,
  -- pgvector column for production upgrade path (uncomment when using vector extension)
  -- embedding   VECTOR(1536),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_fts ON knowledge_articles USING GIN (fts_vector);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_articles(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_active ON knowledge_articles(is_active);

-- ============ ANALYTICS EVENTS ============
CREATE TABLE IF NOT EXISTS analytics_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  event_type      TEXT NOT NULL,
  payload         JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type, created_at DESC);

-- ============ ROW LEVEL SECURITY ============
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Backend (service_role) has full access to all tables
CREATE POLICY "service_role_all_conversations" ON conversations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_messages" ON messages
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_analytics" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');

-- Knowledge articles: anyone can read active articles, authenticated (admins) can write
CREATE POLICY "public_read_knowledge" ON knowledge_articles
  FOR SELECT USING (is_active = TRUE OR auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "admin_write_knowledge" ON knowledge_articles
  FOR INSERT WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "admin_update_knowledge" ON knowledge_articles
  FOR UPDATE USING (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "admin_delete_knowledge" ON knowledge_articles
  FOR DELETE USING (auth.role() IN ('authenticated', 'service_role'));

-- ============ REALTIME ============
-- Enable Realtime in Supabase Dashboard (Database > Replication) for:
--   - messages (INSERT)
--   - conversations (UPDATE)
-- Or run:
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- ============ SEED: KNOWLEDGE BASE ============
-- Insert 10 knowledge articles to power the RAG system
INSERT INTO knowledge_articles (title, content, category, tags) VALUES

('Return & Refund Policy',
'TechGear offers a 30-day hassle-free return policy on all products. Items must be in original condition with all accessories and packaging. To start a return, contact support with your order number. Once approved, you''ll receive a prepaid FedEx return label via email. Refunds are processed within 3-5 business days to your original payment method. Products showing physical damage, water damage, or missing serial numbers are not eligible for returns.',
'returns', ARRAY['returns', 'refund', 'policy', '30-day']),

('Shipping & Delivery Information',
'TechGear offers free standard shipping on orders over $50. Standard shipping (5-7 business days) is $9.99 for orders under $50. Expedited shipping (2-3 days) is $19.99. Overnight shipping is $39.99. Orders placed before 2 PM EST ship the same business day. We ship via FedEx and UPS. Tracking information is emailed when your order ships. International shipping is available to 40+ countries starting at $29.99.',
'shipping', ARRAY['shipping', 'delivery', 'tracking', 'fedex']),

('TechGear Warranty Coverage',
'All TechGear products come with a 2-year limited warranty covering manufacturing defects and hardware failures. The warranty does NOT cover physical damage, water damage, accidental damage, or unauthorized modifications. To claim warranty service, contact support with your order number and description of the issue. We''ll arrange a repair or replacement at no cost. Warranty repairs typically take 7-10 business days.',
'warranty', ARRAY['warranty', 'repair', 'coverage', 'guarantee']),

('Order Cancellation & Modification',
'Orders can be cancelled or modified within 2 hours of placement. After 2 hours, the order may have already been picked for shipping. To cancel, log into your account or contact support immediately with your order number. If the order has shipped, you''ll need to initiate a return instead. Cancelled orders are refunded within 24 hours. For modifications (address changes, item swaps), contact support as soon as possible.',
'orders', ARRAY['cancel', 'modify', 'order', 'change']),

('Bluetooth Pairing Troubleshooting',
'If your TechGear wireless device won''t pair: 1) Put the device in pairing mode (hold the power button for 5+ seconds until LED flashes rapidly). 2) On your phone/computer, go to Bluetooth settings and remove any existing TechGear device entries. 3) Select the device from the available list. 4) If still failing, reset the device: hold power + volume down for 10 seconds. 5) Ensure your device''s Bluetooth driver is up to date. For earbuds, make sure both buds are in the case for 10 seconds before pairing.',
'technical', ARRAY['bluetooth', 'pairing', 'wireless', 'troubleshoot']),

('Accepted Payment Methods',
'TechGear accepts: Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay, and TechGear Gift Cards. We also offer Buy Now Pay Later through Affirm (0% APR for 6 months on orders over $200). All transactions are secured with 256-bit SSL encryption. We do not accept cryptocurrency, wire transfers, or checks. For business purchases, Net-30 terms are available with approved credit.',
'payment', ARRAY['payment', 'credit card', 'paypal', 'affirm']),

('Laptop Upgrade & Compatibility',
'TechGear UltraBook laptops feature user-upgradeable RAM and SSD. The UltraBook 14 supports up to 32GB DDR5 RAM (2 SODIMM slots) and M.2 NVMe SSDs up to 2TB. Upgrades performed by TechGear service centers maintain warranty coverage. Third-party upgrades may void warranty on the specific upgraded component. All TechGear laptops use standard parts available from major retailers. Contact support for compatibility confirmation before purchasing upgrade parts.',
'technical', ARRAY['laptop', 'upgrade', 'ram', 'ssd', 'compatibility']),

('How to Track Your Order',
'Track your order in 3 ways: 1) Check your shipping confirmation email for the tracking link. 2) Log into your TechGear account > Orders > select your order. 3) Use the carrier''s website directly with your tracking number (FedEx: fedex.com, UPS: ups.com). Tracking updates in real-time once your package is scanned. If tracking shows "delivered" but you haven''t received the package, wait 24 hours (common for multi-package deliveries) then contact support.',
'orders', ARRAY['tracking', 'order status', 'delivery', 'fedex', 'ups']),

('TechGear ProBuds Active Noise Cancellation',
'The ProBuds X1 features Hybrid ANC technology using 2 external + 1 internal microphone per earbud. ANC can be toggled by pressing the left earbud once. Transparency mode (hear surroundings) is activated by pressing twice. ANC works best in environments with consistent noise (airplane engines, AC units). For best ANC performance, ensure the earbuds fit snugly using the included ear tip size guide. ANC reduces battery life from 36 hours to approximately 24 hours.',
'technical', ARRAY['anc', 'noise cancellation', 'earbuds', 'probuds']),

('Contacting Human Support',
'For complex issues requiring human assistance: Email: support@techgear.com (response within 4 hours). Phone: 1-800-TECHGEAR (Mon-Fri 9 AM - 8 PM EST, Sat 10 AM - 5 PM EST). Live Chat: Available on our website during business hours. For priority support, please have your order number ready. VIP customers (orders over $500 lifetime) get dedicated support agents. Average wait time is under 3 minutes during business hours.',
'general', ARRAY['contact', 'human', 'agent', 'support', 'phone', 'email']);
