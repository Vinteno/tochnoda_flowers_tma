import { createFileRoute } from '@tanstack/react-router'
import { OrderResultPage } from '@/pages/order/result/ui/OrderResultPage'

interface OrderResultSearch {
  status: 'success' | 'error'
  orderId: string
}

export const Route = createFileRoute('/order/result/')({
  component: OrderResultPage,
  validateSearch: (search: Record<string, unknown>): OrderResultSearch => {
    return {
      status: (search.status === 'success' || search.status === 'error') ? search.status : 'error',
      orderId: String(search.orderId || ''),
    }
  },
})
