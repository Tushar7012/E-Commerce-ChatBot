// ============ CHAT ============

export type MessageType = 'text' | 'markdown' | 'product_card' | 'order_card' | 'quick_replies' | 'system'
export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  messageType: MessageType
  metadata: MessageMetadata
  createdAt: string
  // Optimistic UI
  status?: 'sending' | 'sent' | 'error'
}

export interface MessageMetadata {
  productId?: string
  product?: Product
  orderNumber?: string
  order?: Order
  options?: string[]  // quick replies
}

export interface ConversationRecord {
  id: string
  session_id: string
  customer_name: string | null
  customer_email: string | null
  status: 'active' | 'resolved' | 'escalated'
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Joined
  messages?: DbMessage[]
  messageCount?: number
  lastMessage?: string
}

export interface DbMessage {
  id: string
  conversation_id: string
  role: MessageRole
  content: string
  message_type: MessageType
  metadata: MessageMetadata
  created_at: string
}

// ============ PRODUCTS ============

export interface Product {
  id: string
  name: string
  tagline: string
  price: number
  originalPrice?: number
  imageUrl: string
  rating: number
  reviewCount: number
  inStock: boolean
  stockQuantity: number
  badge?: string
  category: string
  brand: string
  sku: string
  specs: Record<string, string | boolean | number>
  tags: string[]
}

// ============ ORDERS ============

export type OrderStatus =
  | 'pending' | 'confirmed' | 'processing'
  | 'shipped' | 'delivered' | 'cancelled'
  | 'return_requested' | 'refunded'

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
}

export interface StatusHistoryItem {
  status: OrderStatus
  label: string
  date: string
  note?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  statusHistory: StatusHistoryItem[]
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
  trackingNumber?: string
  trackingUrl?: string
  carrier?: string
  estimatedDelivery?: string
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: string
  createdAt: string
}

// ============ KNOWLEDGE BASE ============

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============ ANALYTICS ============

export interface AnalyticsStats {
  totalConversations: number
  activeConversations: number
  resolvedToday: number
  totalMessages: number
  avgResponseTime: string
  satisfactionScore: number
  resolutionRate: number
  escalationRate: number
}

export interface DailyVolume {
  date: string
  conversations: number
  resolved: number
  messages: number
}

export interface TopicCount {
  topic: string
  count: number
  percentage: number
}

// ============ API ============

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: { code: string; message: string }
}

export interface SendMessageResponse {
  conversationId: string
  message: string
  messageType: MessageType
  metadata: MessageMetadata
}
