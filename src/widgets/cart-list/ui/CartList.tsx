import { useCartStore } from '@features/cart'
import { formatPrice } from '@shared/lib'
import { Link } from '@tanstack/react-router'
import { LuMinus, LuPlus, LuTrash2 } from 'react-icons/lu'
import { Button } from '@/components/ui/button'

export function CartList() {
  const { items, update: updateCart, remove: removeFromCart } = useCartStore()

  const handleIncrement = (productId: number, currentQty: number) => {
    updateCart(productId, currentQty + 1)
  }

  const handleDecrement = (productId: number, currentQty: number) => {
    if (currentQty <= 1) {
      removeFromCart(productId)
    }
    else {
      updateCart(productId, currentQty - 1)
    }
  }

  return (
    <ul className="flex flex-col gap-2">
      {(items ?? []).map(item => (
        <li key={item.product_id}>
          <Link
            className="flex min-w-0 rounded-md bg-card"
            to="/product/$slug"
            params={{ slug: item.slug }}
          >
            <div className="aspect-square size-28 shrink-0">
              {item.thumbnail
                ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="size-full rounded-l-md object-cover"
                    />
                  )
                : (
                    <div className="size-full rounded-l-md" />
                  )}
            </div>
            <div className="flex grow gap-2 py-2 pr-2 pl-3">
              <div className="
                flex min-w-0 flex-1 flex-col justify-between gap-1
              "
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="line-clamp-2 text-sm/tight">{item.name}</p>
                  {item.best_price < item.price && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-lg font-bold">{formatPrice(item.best_price * item.quantity)}</p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      className="size-7 h-auto! p-0! text-primary"
                      size="icon"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        handleDecrement(item.product_id, item.quantity)
                      }}
                    >
                      {item.quantity <= 1
                        ? (
                            <LuTrash2 className="size-4" strokeWidth={1.5} />
                          )
                        : (
                            <LuMinus className="size-5" strokeWidth={1.5} />
                          )}
                    </Button>
                    <p className="text-sm font-medium">{item.quantity}</p>
                    <Button
                      variant="ghost"
                      className="size-7 h-auto! p-0! text-primary"
                      size="icon"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        handleIncrement(item.product_id, item.quantity)
                      }}
                    >
                      <LuPlus className="size-5" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
