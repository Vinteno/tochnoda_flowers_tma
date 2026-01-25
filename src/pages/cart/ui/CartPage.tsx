import { useCartStore } from '@features/cart'
import { formatPrice, useBackButton } from '@shared/lib'
import { useNavigate } from '@tanstack/react-router'
import { CartList } from '@widgets/cart-list'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BACK_BUTTON_SKIP_ROUTES } from '@/shared'
import { EmptyCartPage } from './EmptyCartPage'

export function CartPage() {
  const navigate = useNavigate()
  const { items, total } = useCartStore()

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  useBackButton({
    navigate,
    skipRoutes: BACK_BUTTON_SKIP_ROUTES,
    fallbackTo: '/',
  })

  if (items.length === 0) {
    return (
      <EmptyCartPage />
    )
  }

  return (
    <>
      <section className="mt-4 flex-1 px-2 pb-2">
        <CartList />
      </section>

      <footer className="sticky bottom-0 w-full rounded-t-3xl bg-background p-2">
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
            {formatPrice(total)}
          </p>
        </Button>
      </footer>
    </>
  )
}
