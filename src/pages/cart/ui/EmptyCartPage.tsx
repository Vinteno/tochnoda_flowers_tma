import { Link } from '@tanstack/react-router'
import { LuArrowLeft, LuShoppingCart } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/shared/ui/empty-state/EmptyState'

export function EmptyCartPage() {
  return (
    <EmptyState
      className="flex-1"
      icon={<LuShoppingCart className="size-24" strokeWidth={1.5} />}
      title="Корзина пуста"
      action={(
        <Button variant="link" asChild>
          <Link to="/">
            <LuArrowLeft strokeWidth={1.5} />
            Вернуться в каталог
          </Link>
        </Button>
      )}
    />
  )
}
