import { useAuthStore } from '@features/auth'
import { useCartStore } from '@features/cart'
import { Link, useNavigate } from '@tanstack/react-router'
import { LuShoppingCart } from 'react-icons/lu'
import EvergreenLogoImage from '@/assets/images/logos/evergreen.png'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Header() {
  const navigate = useNavigate()
  const { items: cartItems } = useCartStore()
  const { user } = useAuthStore()

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="flex items-center justify-between p-2">
      <Link to="/">
        <img src={EvergreenLogoImage} className="h-12" alt="Evergreen" />
      </Link>
      <nav className="flex items-center gap-4">
        <button className="relative" onClick={() => navigate({ to: '/cart' })}>
          <LuShoppingCart className="size-6" strokeWidth={1.5} />
          {cartItemsCount > 0 && (
            <span className="
              absolute -top-1 -right-1 flex size-4 items-center justify-center
              rounded-full bg-primary text-xs font-light text-primary-foreground
            "
            >
              {cartItemsCount}
            </span>
          )}
        </button>
        <Avatar className="size-9">
          <AvatarFallback className="bg-card">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </nav>
    </header>
  )
}
