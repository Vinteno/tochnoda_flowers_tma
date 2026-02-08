import type { OrderStatus } from '../model/types'
import { cn } from '@shared/lib'

const statusConfig: Record<OrderStatus, { label: string, className: string }> = {
  new: { label: 'Новый', className: 'bg-primary/15 text-primary' },
  confirmed: { label: 'Подтверждён', className: 'bg-primary/15 text-primary' },
  processing: { label: 'Собирается', className: 'bg-amber-500/15 text-amber-600' },
  ready: { label: 'Готов', className: 'bg-chart-2/15 text-chart-2' },
  delivering: { label: 'Доставляется', className: 'bg-chart-2/15 text-chart-2' },
  completed: { label: 'Выполнен', className: 'bg-chart-2/15 text-chart-2' },
  cancelled: { label: 'Отменён', className: 'bg-destructive/15 text-destructive' },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        `
          inline-flex items-center rounded-full px-2.5 py-0.5 text-xs
          font-medium
        `,
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}
