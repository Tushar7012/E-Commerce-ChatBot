import { useState } from 'react'
import { ShoppingCart, Search, Star, ArrowRight, Zap, Shield, Truck } from 'lucide-react'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { ChatLauncher } from '@/components/chat/ChatLauncher'
import { ProductCard } from '@/components/chat/ProductCard'
import type { Product } from '@/types'

// Featured products for the store demo
const FEATURED: Product[] = [
  {
    id: 'prod_001',
    name: 'TechGear ProBuds X1',
    tagline: 'ANC Wireless Earbuds',
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
    specs: {},
    tags: [],
  },
  {
    id: 'prod_002',
    name: 'TechGear UltraBook 14',
    tagline: '14" OLED Laptop',
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
    specs: {},
    tags: [],
  },
  {
    id: 'prod_003',
    name: 'TechGear SmartWatch Pro',
    tagline: 'Health & GPS Smartwatch',
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
    specs: {},
    tags: [],
  },
  {
    id: 'prod_007',
    name: 'TechGear ProDisplay 27"',
    tagline: '4K 144Hz IPS Monitor',
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
    specs: {},
    tags: [],
  },
]

const BENEFITS = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Shield, title: '2-Year Warranty', desc: 'All TechGear products' },
  { icon: Zap, title: 'Fast Support', desc: 'AI-powered 24/7' },
]

export function CustomerPage() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">TechGear</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            {['Products', 'Deals', 'Support', 'About'].map(item => (
              <button key={item} className="hover:text-gray-900 transition-colors">{item}</button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Search className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={() => setCartCount(c => c + 1)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-500" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 via-purple-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white/90 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🆕 New Arrivals — UltraBook 14 is here
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Premium Tech,<br />Real Performance.
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Discover TechGear's lineup of consumer electronics built for professionals who demand more.
            </p>
            <div className="flex gap-3">
              <button className="bg-white text-brand-700 font-semibold px-6 py-3 rounded-2xl hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg">
                Shop Now <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-white/30 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/10 transition-all">
                View Deals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-400 text-sm mt-1">Our best-selling items this month</p>
          </div>
          <button className="flex items-center gap-1 text-brand-600 text-sm font-medium hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-gradient-to-r from-brand-50 to-purple-50 border-t border-brand-100">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-gray-700 font-semibold">Rated 4.8/5 by 10,000+ customers</p>
          <p className="text-gray-400 text-sm mt-1">
            Questions? Our AI support is live 24/7 — click the chat button below 👇
          </p>
        </div>
      </section>

      {/* Chat */}
      <ChatWindow />
      <ChatLauncher />
    </div>
  )
}
