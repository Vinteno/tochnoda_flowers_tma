import type { ComponentProps, ReactNode } from 'react'
import type { Product, RelatedProduct } from '../model/types'
import { cn, formatPrice, getImageSources } from '@shared/lib'
import { ResponsiveImage } from '@shared/ui'
import { Link } from '@tanstack/react-router'

interface ProductCardProps extends ComponentProps<'li'> {
  product: Product | RelatedProduct
  action?: ReactNode
}

export function ProductCard({ product, action, ...props }: ProductCardProps) {
  const hasDiscount = product.best_price < product.price

  const thumbnail = product.thumbnail
  const thumbnailSources = getImageSources(thumbnail, 'card')

  return (
    <li
      className={cn('flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm', props.className)}
      {...props}
    >
      <Link
        className="flex flex-1 flex-col"
        to="/product/$slug"
        params={{ slug: product.slug }}
      >
        <div className="h-42 w-full overflow-hidden bg-secondary">
          {thumbnailSources.fallbackSrc
            ? (
                <ResponsiveImage
                  image={thumbnail}
                  mode="card"
                  sources={thumbnailSources}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="h-42 w-full object-cover"
                  width={200}
                  height={168}
                  sizes="(max-width: 640px) 50vw, 200px"
                />
              )
            : (
                <div className="h-42 w-full" />
              )}
        </div>
        <div className="flex grow flex-col justify-between px-2 pt-3 pb-2">
          <h3 className="line-clamp-2 text-sm/tight">{product.name}</h3>
          <div className="mt-1.5 flex grow items-end">
            <div className="flex gap-2">
              <p className={cn('text-lg font-bold', { 'text-primary': hasDiscount })}>
                {formatPrice(product.best_price)}
              </p>
              {hasDiscount && (
                <p className="self-end pb-1 text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
      {action && (
        <div className="px-2 pb-2">
          {action}
        </div>
      )}
    </li>
  )
}
