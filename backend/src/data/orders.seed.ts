export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'refunded'

export interface StatusHistoryItem {
  status: OrderStatus
  label: string
  date: string
  note?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
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
  updatedAt: string
}

export const ORDERS: Order[] = [
  {
    id: 'order_001',
    orderNumber: 'ORD-2024-8847',
    customerId: 'demo-customer',
    status: 'shipped',
    statusHistory: [
      { status: 'confirmed', label: 'Order Confirmed', date: '2024-01-10T09:00:00Z' },
      { status: 'processing', label: 'Processing', date: '2024-01-11T14:30:00Z', note: 'Picked from warehouse' },
      { status: 'shipped', label: 'Shipped', date: '2024-01-12T10:15:00Z', note: 'With FedEx Express' },
      { status: 'delivered', label: 'Est. Delivery', date: '2024-01-15T00:00:00Z' },
    ],
    items: [
      {
        productId: 'prod_001',
        productName: 'TechGear ProBuds X1',
        productImage: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=80&q=80',
        quantity: 1,
        price: 149.99,
        total: 149.99,
      },
    ],
    subtotal: 149.99,
    shipping: 0,
    tax: 12.75,
    total: 162.74,
    currency: 'USD',
    trackingNumber: 'FX1234567890US',
    trackingUrl: 'https://www.fedex.com/tracking',
    carrier: 'FedEx Express',
    estimatedDelivery: '2024-01-15',
    shippingAddress: {
      name: 'Demo Customer',
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
    },
    paymentMethod: 'Visa •••• 4242',
    paymentStatus: 'paid',
    createdAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-12T10:15:00Z',
  },
  {
    id: 'order_002',
    orderNumber: 'ORD-2024-7631',
    customerId: 'demo-customer',
    status: 'delivered',
    statusHistory: [
      { status: 'confirmed', label: 'Order Confirmed', date: '2024-01-02T11:00:00Z' },
      { status: 'processing', label: 'Processing', date: '2024-01-03T09:00:00Z' },
      { status: 'shipped', label: 'Shipped', date: '2024-01-04T16:00:00Z' },
      { status: 'delivered', label: 'Delivered', date: '2024-01-07T14:22:00Z', note: 'Left at front door' },
    ],
    items: [
      {
        productId: 'prod_005',
        productName: 'TechGear MechKeys Pro',
        productImage: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=80&q=80',
        quantity: 1,
        price: 179.99,
        total: 179.99,
      },
      {
        productId: 'prod_008',
        productName: 'TechGear PixelMouse Pro',
        productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80&q=80',
        quantity: 1,
        price: 89.99,
        total: 89.99,
      },
    ],
    subtotal: 269.98,
    shipping: 0,
    tax: 22.95,
    total: 292.93,
    currency: 'USD',
    trackingNumber: 'UPS987654321',
    carrier: 'UPS Ground',
    shippingAddress: {
      name: 'Demo Customer',
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
    },
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    createdAt: '2024-01-02T10:30:00Z',
    updatedAt: '2024-01-07T14:22:00Z',
  },
  {
    id: 'order_003',
    orderNumber: 'ORD-2024-9102',
    customerId: 'demo-customer',
    status: 'processing',
    statusHistory: [
      { status: 'confirmed', label: 'Order Confirmed', date: '2024-01-13T15:00:00Z' },
      { status: 'processing', label: 'Processing', date: '2024-01-14T08:00:00Z' },
    ],
    items: [
      {
        productId: 'prod_002',
        productName: 'TechGear UltraBook 14',
        productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&q=80',
        quantity: 1,
        price: 1299.99,
        total: 1299.99,
      },
    ],
    subtotal: 1299.99,
    shipping: 0,
    tax: 110.50,
    total: 1410.49,
    currency: 'USD',
    estimatedDelivery: '2024-01-18',
    shippingAddress: {
      name: 'Demo Customer',
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
    },
    paymentMethod: 'Visa •••• 4242',
    paymentStatus: 'paid',
    createdAt: '2024-01-13T14:45:00Z',
    updatedAt: '2024-01-14T08:00:00Z',
  },
  {
    id: 'order_004',
    orderNumber: 'ORD-2023-5519',
    customerId: 'demo-customer',
    status: 'refunded',
    statusHistory: [
      { status: 'confirmed', label: 'Order Confirmed', date: '2023-12-20T10:00:00Z' },
      { status: 'shipped', label: 'Shipped', date: '2023-12-21T11:00:00Z' },
      { status: 'delivered', label: 'Delivered', date: '2023-12-24T16:00:00Z' },
      { status: 'return_requested', label: 'Return Requested', date: '2023-12-26T09:00:00Z', note: 'Defective unit' },
      { status: 'refunded', label: 'Refunded', date: '2023-12-30T14:00:00Z', note: 'Full refund to original payment' },
    ],
    items: [
      {
        productId: 'prod_003',
        productName: 'TechGear SmartWatch Pro',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=80',
        quantity: 1,
        price: 249.99,
        total: 249.99,
      },
    ],
    subtotal: 249.99,
    shipping: 0,
    tax: 21.25,
    total: 271.24,
    currency: 'USD',
    shippingAddress: {
      name: 'Demo Customer',
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
    },
    paymentMethod: 'Visa •••• 4242',
    paymentStatus: 'refunded',
    createdAt: '2023-12-20T09:30:00Z',
    updatedAt: '2023-12-30T14:00:00Z',
  },
  {
    id: 'order_005',
    orderNumber: 'ORD-2024-9988',
    customerId: 'demo-customer',
    status: 'pending',
    statusHistory: [
      { status: 'pending', label: 'Awaiting Payment', date: '2024-01-14T22:30:00Z' },
    ],
    items: [
      {
        productId: 'prod_007',
        productName: 'TechGear ProDisplay 27"',
        productImage: 'https://images.unsplash.com/photo-1527443224154-c4a573d5c271?w=80&q=80',
        quantity: 1,
        price: 499.99,
        total: 499.99,
      },
      {
        productId: 'prod_006',
        productName: 'TechGear HubMax 8-in-1',
        productImage: 'https://images.unsplash.com/photo-1625948515929-ca97d9c2f9d4?w=80&q=80',
        quantity: 2,
        price: 59.99,
        total: 119.98,
      },
    ],
    subtotal: 619.97,
    shipping: 9.99,
    tax: 52.70,
    total: 682.66,
    currency: 'USD',
    shippingAddress: {
      name: 'Demo Customer',
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
    },
    paymentMethod: 'Pending',
    paymentStatus: 'pending',
    createdAt: '2024-01-14T22:30:00Z',
    updatedAt: '2024-01-14T22:30:00Z',
  },
]

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return ORDERS.find(o => o.orderNumber === orderNumber)
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return ORDERS.filter(o => o.customerId === customerId)
}
