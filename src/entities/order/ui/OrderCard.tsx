import type { Order } from '../model/types'
import { formatPrice } from '@shared/lib'
import { format } from 'date-fns'
import { LuMapPin, LuTruck } from 'react-icons/lu'
import { Separator } from '@/components/ui/separator'
import { OrderStatusBadge } from './OrderStatusBadge'

interface OrderCardProps {
  order: Order
}

function formatItemsSummary(order: Order): string {
  const names = order.items.map(item => item.product_name)
  if (names.length <= 2) {
    return names.join(', ')
  }
  return `${names.slice(0, 2).join(', ')} +${names.length - 2}`
}

export function OrderCard({ order }: OrderCardProps) {
  const createdDate = format(new Date(order.created_at), 'dd.MM.yyyy')
  const isDelivery = order.delivery_type === 'delivery'

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="font-serif text-lg">
          #
          {order.id}
        </span>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.items.length > 0 && (
        <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">
          {formatItemsSummary(order)}
        </p>
      )}

      <Separator className="my-3 bg-border/30" />

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">
          {formatPrice(order.total)}
        </span>
        <span className="
          flex items-center gap-1.5 text-xs text-muted-foreground
        "
        >
          {isDelivery
            ? <LuTruck className="size-3.5" strokeWidth={1.5} />
            : <LuMapPin className="size-3.5" strokeWidth={1.5} />}
          {isDelivery ? 'Доставка' : 'Самовывоз'}
          <span className="text-border">·</span>
          {createdDate}
        </span>
      </div>
    </div>
  )
}
