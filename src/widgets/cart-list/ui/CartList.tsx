import { useCartStore } from '@features/cart'
import { formatPrice, getImageSources } from '@shared/lib'
import { ResponsiveImage } from '@shared/ui'
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
      {(items ?? []).map((item) => {
        const thumbSources = getImageSources(item.thumbnail, 'thumb')
        return (
          <li
            key={item.product_id}
            className="flex min-w-0 overflow-hidden rounded-xl bg-card"
          >
            <Link className="aspect-square size-28 shrink-0 bg-secondary" to="/product/$slug" params={{ slug: item.slug }}>
              {thumbSources.fallbackSrc
                ? (
                    <ResponsiveImage
                      image={item.thumbnail}
                      mode="thumb"
                      sources={thumbSources}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                      width={112}
                      height={112}
                      sizes="112px"
                    />
                  )
                : (
                    <div className="size-full bg-secondary" />
                  )}
            </Link>
            <div className="flex grow gap-2 px-3 py-2">
              <Link
                to="/product/$slug"
                params={{ slug: item.slug }}
                className="
                  flex min-w-0 flex-1 flex-col justify-between gap-1 bg-card
                "
              >
                <div className="flex flex-col gap-1">
                  <p className="line-clamp-2 leading-tight">{item.name}</p>
                  {item.price !== item.best_price && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.price)}
                    </p>
                  )}
                </div>
                <p className="text-lg font-bold">{formatPrice(item.best_price * item.quantity)}</p>
              </Link>
              <div className="flex flex-col items-center justify-between">
                <Button
                  variant="secondary"
                  className="size-7 rounded-full bg-transparent"
                  size="icon"
                  onClick={() => handleIncrement(item.product_id, item.quantity)}
                  disabled={item.stock_quantity <= 0 || item.quantity >= item.stock_quantity}
                >
                  <LuPlus className="size-5" strokeWidth={1.5} />
                </Button>
                <p className="text-sm font-medium">{item.quantity}</p>
                <Button
                  variant="secondary"
                  className="size-7 rounded-full bg-transparent"
                  size="icon"
                  onClick={() => handleDecrement(item.product_id, item.quantity)}
                >
                  {item.quantity <= 1
                    ? (
                        <LuTrash2 className="size-4" strokeWidth={1.5} />
                      )
                    : (
                        <LuMinus className="size-5" strokeWidth={1.5} />
                      )}
                </Button>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
