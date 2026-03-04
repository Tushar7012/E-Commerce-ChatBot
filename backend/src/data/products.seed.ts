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

export const PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'TechGear ProBuds X1',
    tagline: 'Active Noise Cancellation Wireless Earbuds',
    price: 149.99,
    originalPrice: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&q=80',
    rating: 4.7,
    reviewCount: 2341,
    inStock: true,
    stockQuantity: 48,
    badge: 'Best Seller',
    category: 'audio',
    brand: 'TechGear',
    sku: 'TG-PB-X1',
    specs: { battery: '36 hrs', anc: true, waterproof: 'IPX5', connectivity: 'Bluetooth 5.3', drivers: '11mm' },
    tags: ['wireless', 'anc', 'earbuds', 'audio'],
  },
  {
    id: 'prod_002',
    name: 'TechGear UltraBook 14',
    tagline: '14" OLED Laptop, Intel Core Ultra 7, 16GB RAM',
    price: 1299.99,
    originalPrice: 1499.99,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
    rating: 4.9,
    reviewCount: 856,
    inStock: true,
    stockQuantity: 12,
    badge: 'New Arrival',
    category: 'laptops',
    brand: 'TechGear',
    sku: 'TG-UB-14',
    specs: { cpu: 'Intel Core Ultra 7', ram: '16GB LPDDR5', storage: '512GB SSD', display: '14" 2.8K OLED', battery: '76Wh' },
    tags: ['laptop', 'oled', 'ultrabook', 'portable'],
  },
  {
    id: 'prod_003',
    name: 'TechGear SmartWatch Pro',
    tagline: 'Health & Fitness Smartwatch with GPS',
    price: 249.99,
    originalPrice: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    rating: 4.5,
    reviewCount: 1204,
    inStock: true,
    stockQuantity: 35,
    badge: 'Popular',
    category: 'wearables',
    brand: 'TechGear',
    sku: 'TG-SW-PRO',
    specs: { battery: '7 days', gps: true, waterproof: '5ATM', display: '1.4" AMOLED', sensors: 'HR, SpO2, Stress' },
    tags: ['smartwatch', 'fitness', 'gps', 'health'],
  },
  {
    id: 'prod_004',
    name: 'TechGear Vision 4K Webcam',
    tagline: '4K 60fps Webcam with AI Auto-framing',
    price: 129.99,
    originalPrice: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&q=80',
    rating: 4.6,
    reviewCount: 672,
    inStock: true,
    stockQuantity: 27,
    category: 'peripherals',
    brand: 'TechGear',
    sku: 'TG-WC-4K',
    specs: { resolution: '4K 60fps', fov: '90°', mic: 'Dual stereo noise-cancelling', ai: 'Auto-framing', connection: 'USB-C' },
    tags: ['webcam', '4k', 'streaming', 'wfh'],
  },
  {
    id: 'prod_005',
    name: 'TechGear MechKeys Pro',
    tagline: 'Wireless Mechanical Keyboard, Hot-swap',
    price: 179.99,
    originalPrice: 219.99,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80',
    rating: 4.8,
    reviewCount: 934,
    inStock: true,
    stockQuantity: 19,
    badge: 'Editor\'s Choice',
    category: 'peripherals',
    brand: 'TechGear',
    sku: 'TG-KB-PRO',
    specs: { switches: 'TechGear Red (hot-swap)', battery: '4000mAh', connection: 'Tri-mode BT/2.4G/USB-C', rgb: true, layout: 'TKL 80%' },
    tags: ['keyboard', 'mechanical', 'wireless', 'gaming'],
  },
  {
    id: 'prod_006',
    name: 'TechGear HubMax 8-in-1',
    tagline: 'USB-C Hub with 4K HDMI, 100W PD',
    price: 59.99,
    originalPrice: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1625948515929-ca97d9c2f9d4?w=400&q=80',
    rating: 4.4,
    reviewCount: 1543,
    inStock: true,
    stockQuantity: 66,
    category: 'accessories',
    brand: 'TechGear',
    sku: 'TG-HB-8',
    specs: { ports: 'HDMI 4K, 3×USB-A, USB-C PD 100W, SD, microSD, 3.5mm', powerDelivery: '100W', hdmi: '4K@60Hz' },
    tags: ['hub', 'usb-c', 'accessories', 'dongle'],
  },
  {
    id: 'prod_007',
    name: 'TechGear ProDisplay 27"',
    tagline: '27" 4K IPS Monitor, 144Hz, HDR400',
    price: 499.99,
    originalPrice: 599.99,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a573d5c271?w=400&q=80',
    rating: 4.7,
    reviewCount: 428,
    inStock: true,
    stockQuantity: 8,
    badge: 'Sale',
    category: 'displays',
    brand: 'TechGear',
    sku: 'TG-MON-27',
    specs: { size: '27"', resolution: '4K UHD', refreshRate: '144Hz', panel: 'IPS', hdr: 'HDR400', responseTime: '1ms GTG' },
    tags: ['monitor', '4k', 'ips', 'gaming'],
  },
  {
    id: 'prod_008',
    name: 'TechGear PixelMouse Pro',
    tagline: 'Wireless Gaming Mouse, 26K DPI Sensor',
    price: 89.99,
    originalPrice: 109.99,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
    rating: 4.6,
    reviewCount: 1876,
    inStock: true,
    stockQuantity: 52,
    category: 'peripherals',
    brand: 'TechGear',
    sku: 'TG-MS-PRO',
    specs: { sensor: '26K DPI optical', battery: '70 hrs', weight: '61g', buttons: '6 programmable', connection: '2.4G / USB-C' },
    tags: ['mouse', 'gaming', 'wireless', 'lightweight'],
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.tagline.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.includes(q))
  )
}
