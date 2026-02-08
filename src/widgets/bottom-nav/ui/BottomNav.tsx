import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@shared/lib'
import { Link } from '@tanstack/react-router'
import { LuHistory, LuShoppingCart, LuStore } from 'react-icons/lu'
import { Button } from '@/components/ui/button'

type BottomNavItem = 'home' | 'cart' | 'orders'

interface BottomNavProps extends ComponentProps<'footer'> {
  active?: BottomNavItem
  action?: ReactNode
}

export function BottomNav({ active = 'home', action, className, ...props }: BottomNavProps) {
  return (
    <footer
      className={cn(
        `
          fixed right-0 bottom-0 left-0 w-full rounded-t-lg bg-background px-2
          pt-2 safe-area-bottom
        `,
        className,
      )}
      {...props}
    >
      {action && (
        <div className="mb-2">
          {action}
        </div>
      )}
      <nav className="flex w-full justify-evenly">
        <Button
          size="icon"
          className={cn('flex size-auto flex-col gap-0 px-6 pt-1 pb-0.5 text-xs', { 'text-primary': active === 'home' })}
          variant="ghost"
          asChild
        >
          <Link to="/">
            <LuStore strokeWidth={1.5} className="size-6" />
            Главная
          </Link>
        </Button>
        <Button
          size="icon"
          className={cn('flex size-auto flex-col gap-0 px-6 pt-1 pb-0.5 text-xs', { 'text-primary': active === 'cart' })}
          variant="ghost"
          asChild
        >
          <Link to="/cart">
            <LuShoppingCart strokeWidth={1.5} className="size-6" />
            Корзина
          </Link>
        </Button>
        <Button
          size="icon"
          className={cn('flex size-auto flex-col gap-0 px-6 pt-1 pb-0.5 text-xs', { 'text-primary': active === 'orders' })}
          variant="ghost"
          asChild
        >
          <Link to="/orders">
            <LuHistory strokeWidth={1.5} className="size-6" />
            Заказы
          </Link>
        </Button>
      </nav>
    </footer>
  )
}
