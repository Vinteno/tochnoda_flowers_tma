import type { Product } from '@entities/product'
import { ProductCard } from '@entities/product'
import { EmptyState } from '@/shared'
import { ProductListSkeleton } from './ProductListSkeleton'

interface ProductListProps {
  products: Product[] | undefined
  isLoading: boolean
}

export function ProductList({
  products,
  isLoading,
}: ProductListProps) {
  if (isLoading) {
    return (
      <ProductListSkeleton />
    )
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState title="Товары не найдены" />
    )
  }

  return (
    <ul className="my-2 grid grid-cols-2 gap-2 px-2">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  )
}
