import { OrderCard, useUserOrders } from '@entities/order'
import { useBackButton } from '@shared/lib'
import { useNavigate } from '@tanstack/react-router'
import { BottomNav } from '@widgets/bottom-nav'
import { useCallback, useMemo } from 'react'
import { EmptyOrdersPage } from './EmptyOrdersPage'

function OrdersPageSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-12 rounded-sm bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
          </div>
          <div className="mt-2 h-4 w-3/4 rounded-sm bg-muted" />
          <div className="my-3 h-px bg-border" />
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 rounded-sm bg-muted" />
            <div className="h-4 w-32 rounded-sm bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function OrdersPage() {
  const navigate = useNavigate()
  const { data: orders, isLoading } = useUserOrders()

  const handleBack = useCallback(() => {
    navigate({ to: '/' })
  }, [navigate])

  useBackButton(handleBack)

  const sortedOrders = useMemo(() => {
    if (!orders) {
      return []
    }
    return [...orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
  }, [orders])

  if (!isLoading && (!orders || orders.length === 0)) {
    return <EmptyOrdersPage />
  }

  return (
    <>
      <section className="mt-4 flex-1 px-2 pb-40">
        {isLoading
          ? <OrdersPageSkeleton />
          : (
              <div className="flex flex-col gap-2">
                {sortedOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
      </section>

      <BottomNav active="orders" />
    </>
  )
}
