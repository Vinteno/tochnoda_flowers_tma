import type { ComponentProps } from 'react'
import type { Product, RelatedProduct } from '../model/types'
import { cn, formatPrice } from '@shared/lib'
import { Link } from '@tanstack/react-router'
import { LazyLoadImage } from 'react-lazy-load-image-component'

interface ProductCardProps extends ComponentProps<'li'> {
  product: Product | RelatedProduct
}

export function ProductCard({ product, ...props }: ProductCardProps) {
  const hasDiscount = product.best_price < product.price

  return (
    <li {...props}>
      <Link
        className="
          flex h-full cursor-pointer flex-col overflow-hidden rounded-md bg-card
        "
        to="/product/$slug"
        params={{ slug: product.slug }}
      >
        <div className="h-42 w-full overflow-hidden">
          {product.thumbnail
            ? (
                <LazyLoadImage
                  src={product.thumbnail}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="h-42 w-full object-cover"
                  height={168}
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
              <p className={cn('text-lg font-bold', { 'text-primary': hasDiscount })}>
                {formatPrice(product.best_price)}
              </p>
              {hasDiscount && (
                <p className="
                  self-end pb-1 text-sm text-muted-foreground line-through
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
