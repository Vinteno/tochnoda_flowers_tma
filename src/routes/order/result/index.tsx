import { createFileRoute } from '@tanstack/react-router'
import { OrderResultPage } from '@/pages/order/result/ui/OrderResultPage'

interface OrderResultSearch {
  status: 'success' | 'error' | 'pending'
  orderId: string
}

export const Route = createFileRoute('/order/result/')({
  component: OrderResultPage,
  validateSearch: (search: Record<string, unknown>): OrderResultSearch => {
    const status = search.status
    const validStatuses = ['success', 'error', 'pending']
    return {
      status: (typeof status === 'string' && validStatuses.includes(status))
        ? status as 'success' | 'error' | 'pending'
        : 'error',
      orderId: String(search.orderId || ''),
    }
  },
})
