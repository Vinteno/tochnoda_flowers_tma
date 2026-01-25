import { useDeliveryFees } from '@entities/delivery'
import { useCartStore } from '@features/cart'
import { formatPrice, useBackButton } from '@shared/lib'
import { useNavigate } from '@tanstack/react-router'
import { CartList } from '@widgets/cart-list'
import { ArrowRight } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyCartPage } from './EmptyCartPage'

export function CartPage() {
  const navigate = useNavigate()
  const { items, subtotal } = useCartStore()
  const { data: deliveryFees } = useDeliveryFees(subtotal)

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const deliveryFee = deliveryFees?.resolved_fee ?? 0
  const totalWithDelivery = subtotal + deliveryFee

  const handleBack = useCallback(() => {
    navigate({ to: '/' })
  }, [navigate])

  useBackButton(handleBack)

  if (items.length === 0) {
    return (
      <EmptyCartPage />
    )
  }

  return (
    <>
      <section className="mt-4 flex-1 px-2 pb-28">
        <CartList />
      </section>

      <footer className="
        fixed right-0 bottom-0 left-0 w-full rounded-t-3xl bg-background px-2
        pt-2 safe-area-bottom
      "
      >
        <Button
          className="
            flex h-11 w-full flex-col gap-0 rounded-full text-base/tight
          "
          onClick={() => navigate({ to: '/checkout' })}
        >
          <div className="flex items-center gap-1.5">
            Перейти к оформлению
            <ArrowRight />
          </div>
          <p className="text-xs font-normal">
            {totalQuantity}
            {' '}
            шт,
            {' '}
            {formatPrice(totalWithDelivery)}
          </p>
        </Button>
      </footer>
    </>
  )
}
