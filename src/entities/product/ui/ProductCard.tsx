import type { ComponentProps } from 'react'
import type { Product } from '../model/types'
import { cn, formatPrice } from '@shared/lib'
import { Link } from '@tanstack/react-router'

interface ProductCardProps extends ComponentProps<'li'> {
  product: Product
}

export function ProductCard({ product, ...props }: ProductCardProps) {
  return (
    <li {...props}>
      <Link
        className="
          flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-card
        "
        to="/product/$slug"
        params={{ slug: product.slug }}
      >
        <div className="h-42 w-full overflow-hidden bg-secondary">
          {product.thumbnail
            ? (
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="h-42 w-full object-cover"
                />
              )
            : (
                <div className="h-42 w-full" />
              )}
        </div>
        <div className="flex grow flex-col justify-between px-2 py-3">
          <h3 className="line-clamp-2 text-sm/tight">{product.name}</h3>
          <div className="mt-1.5 flex grow items-end">
            <div className="flex gap-2">
              <p className={cn('font-bold', { 'text-primary': product.has_discount })}>
                {formatPrice(product.best_price)}
              </p>
              {product.has_discount && (
                <p className="
                  self-end pb-1 text-xs text-muted-foreground line-through
                "
                >
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
