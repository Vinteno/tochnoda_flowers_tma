import type { Product } from '@entities/product'
import { Link } from '@tanstack/react-router'
import { LuMinus, LuPlus, LuShoppingCart } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared'
import { useCartStore } from '../model/store'

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
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
    if (!cartItem) {
      return
    }
    updateCart(product.id, cartItem.quantity + 1)
  }

  const handleDecrement = () => {
    if (!cartItem) {
      return
    }
    if (cartItem.quantity <= 1) {
      removeFromCart(product.id)
    }
    else {
      updateCart(product.id, cartItem.quantity - 1)
    }
  }

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
    <div className={cn(`grid h-10 grid-cols-2 gap-2`, className)}>
      <div className="h-full">
        <Button className="size-full!" asChild>
          <Link to="/cart">
            <LuShoppingCart />
            В корзину
          </Link>
        </Button>
      </div>
      <div className="
        flex size-full items-center justify-between rounded-md bg-secondary p-1
        text-secondary-foreground
      "
      >
        <Button
          size="icon"
          className="size-8"
          variant="ghost"
          onClick={handleDecrement}
        >
          <LuMinus className="size-5" strokeWidth={1.5} />
        </Button>
        <div className="
          flex flex-col items-center justify-center text-center text-sm
        "
        >
          <p className="leading-tight font-medium">
            {cartItem?.quantity}
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
