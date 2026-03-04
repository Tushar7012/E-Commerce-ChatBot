import { Package, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react'
import { formatCurrency, formatDateFull, ORDER_STATUS_COLORS } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Order, OrderStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_ICONS: Record<string, typeof Package> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  return_requested: Package,
  refunded: CheckCircle,
}

const ACTIVE_STATUSES: OrderStatus[] = ['confirmed', 'processing', 'shipped', 'delivered']

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const StatusIcon = STATUS_ICONS[order.status] ?? Package

  const activeStep = ACTIVE_STATUSES.indexOf(order.status as OrderStatus)

  return (
    <div className="w-72 bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden animate-slide-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80">Order</p>
            <p className="font-bold text-lg">{order.orderNumber}</p>
          </div>
          <div className={cn('px-2 py-1 rounded-full text-xs font-semibold capitalize', ORDER_STATUS_COLORS[order.status])}>
            {order.status.replace('_', ' ')}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Items */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.productId} className="flex-shrink-0">
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48' }}
              />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium flex-shrink-0">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        {/* Progress timeline */}
        {ACTIVE_STATUSES.some(s => s === order.status) && (
          <div>
            <div className="flex items-center justify-between mb-1">
              {ACTIVE_STATUSES.map((step, idx) => {
                const isCompleted = idx <= activeStep
                const isCurrent = idx === activeStep
                return (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all',
                      isCompleted ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400',
                      isCurrent && 'ring-2 ring-brand-300 ring-offset-1'
                    )}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    {idx < ACTIVE_STATUSES.length - 1 && (
                      <div className={cn('absolute h-0.5 w-[calc(25%-12px)] mt-3',
                        idx < activeStep ? 'bg-brand-500' : 'bg-gray-200'
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              {ACTIVE_STATUSES.map(s => (
                <span key={s} className="capitalize text-center flex-1 leading-tight">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="space-y-2 text-sm">
          {order.trackingNumber && (
            <div className="flex items-center gap-2 text-gray-600">
              <Truck className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs">
                {order.carrier}: <span className="font-mono text-brand-600">{order.trackingNumber}</span>
              </span>
            </div>
          )}
          {order.estimatedDelivery && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs">Est. delivery: <strong>{formatDateFull(order.estimatedDelivery)}</strong></span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
          <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  )
}
