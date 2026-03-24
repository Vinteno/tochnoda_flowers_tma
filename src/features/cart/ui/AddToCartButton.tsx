import type { Product } from '@entities/product'
import { Link } from '@tanstack/react-router'
import { LuMinus, LuPlus, LuShoppingCart, LuTrash2 } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared'
import { useCartStore } from '../model/store'

interface AddToCartButtonProps {
  product: Product
  className?: string
  compact?: boolean
}

export function AddToCartButton({ product, className, compact = false }: AddToCartButtonProps) {
  const { add: addToCart, update: updateCart, remove: removeFromCart, items } = useCartStore()

  const cartItem = items.find(item => item.product_id === product.id)
  const inCart = !!cartItem
  const isOutOfStock = product.stock_quantity <= 0

  const handleAddToCart = () => {
    addToCart(product.id, 1, {
      name: product.name,
      slug: product.slug,
      price: product.price,
      best_price: product.best_price,
      thumbnail: product.thumbnail,
      sku: product.sku,
      stock_quantity: product.stock_quantity,
    })
  }

  const handleIncrement = () => {
    if (!cartItem)
      return
    updateCart(product.id, cartItem.quantity + 1)
  }

  const handleDecrement = () => {
    if (!cartItem)
      return
    if (cartItem.quantity <= 1) {
      removeFromCart(product.id)
    }
    else {
      updateCart(product.id, cartItem.quantity - 1)
    }
  }

  const DecrementIcon = cartItem && cartItem.quantity <= 1
    ? <LuTrash2 className="size-4" />
    : <LuMinus className="size-4" strokeWidth={1.5} />

  // Compact mode — used inside ProductCard on listing pages
  if (compact) {
    if (!inCart) {
      return (
        <Button
          className={cn('h-8 w-full text-xs', className)}
          size="sm"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock
            ? 'Нет в наличии'
            : (
                <>
                  <LuPlus className="size-3.5" />
                  В корзину
                </>
              )}
        </Button>
      )
    }

    return (
      <div
        className={cn(
          'flex h-8 w-full items-center justify-between rounded-md bg-secondary px-1 text-secondary-foreground',
          className,
        )}
      >
        <Button
          size="icon"
          className="size-6"
          variant="ghost"
          onClick={handleDecrement}
        >
          {DecrementIcon}
        </Button>
        <span className="text-xs font-medium">
          {cartItem.quantity}
          {' '}
          шт.
        </span>
        <Button
          size="icon"
          className="size-6"
          variant="ghost"
          onClick={handleIncrement}
          disabled={isOutOfStock || cartItem.quantity >= product.stock_quantity}
        >
          <LuPlus className="size-4" strokeWidth={1.5} />
        </Button>
      </div>
    )
  }

  // Default (full) mode — used on product detail page
  if (!inCart) {
    return (
      <Button
        className={className}
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? 'Нет в наличии' : 'Добавить в корзину'}
      </Button>
    )
  }

  return (
    <div className={cn('grid h-10 grid-cols-2 gap-2', className)}>
      <div className="h-full">
        <Button className="size-full!" asChild>
          <Link to="/cart">
            <LuShoppingCart />
            В корзину
          </Link>
        </Button>
      </div>
      <div className="flex size-full items-center justify-between rounded-md bg-secondary p-1 text-secondary-foreground">
        <Button
          size="icon"
          className="size-8"
          variant="ghost"
          onClick={handleDecrement}
        >
          {DecrementIcon}
        </Button>
        <div className="flex flex-col items-center justify-center text-center text-sm">
          <p className="font-medium leading-tight">
            {cartItem.quantity}
            {' '}
            шт.
          </p>
        </div>
        <Button
          size="icon"
          className="size-8"
          variant="ghost"
          onClick={handleIncrement}
          disabled={isOutOfStock || cartItem.quantity >= product.stock_quantity}
        >
          <LuPlus className="size-5" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}
