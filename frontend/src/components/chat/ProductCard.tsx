import { ShoppingCart, Star, ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="w-64 bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden animate-slide-in flex-shrink-0">
      {/* Image */}
      <div className="relative h-36 bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Product'
          }}
        />
        {product.badge && (
          <span className="absolute top-2 left-2">
            <Badge variant="purple">{product.badge}</Badge>
          </span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{product.brand}</p>
        <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{product.name}</h4>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${star <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>

        {/* Stock */}
        <p className={`text-xs mt-0.5 ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
          {product.inStock ? `In Stock (${product.stockQuantity} left)` : 'Out of Stock'}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            disabled={!product.inStock}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-500 to-purple-600 text-white text-xs font-medium py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
