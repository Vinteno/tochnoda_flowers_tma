import { useCartStore } from '@features/cart'
import { formatPrice, useBackButton } from '@shared/lib'
import { Link, useNavigate } from '@tanstack/react-router'
import { BottomNav } from '@widgets/bottom-nav'
import { CartList } from '@widgets/cart-list'
import { ArrowRight } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyCartPage } from './EmptyCartPage'

export function CartPage() {
  const navigate = useNavigate()
  const { items, total } = useCartStore()

  const totalQuantity = (items ?? []).reduce((sum, item) => sum + item.quantity, 0)

  const handleBack = useCallback(() => {
    navigate({ to: '/' })
  }, [navigate])

  useBackButton(handleBack)

  if (!items || items.length === 0) {
    return (
      <EmptyCartPage />
    )
  }

  return (
    <>
      <section className="mt-4 flex-1 px-2 pb-28">
        <CartList />
      </section>

      <BottomNav
        active="cart"
        action={(
          <Button
            className="flex h-10 w-full flex-col gap-0 text-sm/tight"
            asChild
          >
            <Link to="/checkout">
              <div className="flex items-center gap-1.5">
                Перейти к оформлению
                <ArrowRight />
              </div>
              <p className="text-xs font-normal">
                {totalQuantity}
                {' '}
                шт,
                {' '}
                {formatPrice(total)}
              </p>
            </Link>
          </Button>
        )}
      />
    </>
  )
}
