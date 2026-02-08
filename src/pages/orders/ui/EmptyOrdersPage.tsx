import { Link } from '@tanstack/react-router'
import { LuArrowLeft, LuHistory } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/shared/ui/empty-state/EmptyState'
import { BottomNav } from '@/widgets/bottom-nav'

export function EmptyOrdersPage() {
  return (
    <>
      <EmptyState
        className="flex-1"
        icon={<LuHistory className="size-24" strokeWidth={1.5} />}
        title="У вас пока нет заказов"
        action={(
          <Button variant="link" asChild>
            <Link to="/">
              <LuArrowLeft strokeWidth={1.5} />
              Перейти в каталог
            </Link>
          </Button>
        )}
      />
      <BottomNav active="orders" />
    </>
  )
}
