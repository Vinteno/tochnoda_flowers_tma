import type { Product } from '@entities/product'
import { LuMinus, LuPlus } from 'react-icons/lu'
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
    <div className={cn(`
      flex h-11 w-full items-center justify-between rounded-full bg-secondary
      p-1
    `, className)}
    >
      <Button
        size="icon"
        className="size-9 rounded-full bg-background text-foreground"
        onClick={handleDecrement}
      >
        <LuMinus className="size-5" strokeWidth={1.5} />
      </Button>
      <div className="flex flex-col items-center justify-center text-center">
        <p className="leading-tight font-medium">
          {cartItem?.quantity}
          {' '}
          шт.
        </p>
        <p className="text-xs/tight">в корзине</p>
      </div>
      <Button
        size="icon"
        className="size-9 rounded-full bg-background text-foreground"
        onClick={handleIncrement}
        disabled={isOutOfStock || cartItem.quantity >= product.stock_quantity}
      >
        <LuPlus className="size-5" strokeWidth={1.5} />
      </Button>
    </div>
  )
}
