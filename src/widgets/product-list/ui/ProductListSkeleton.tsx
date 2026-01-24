import { ProductCardSkeleton } from '@/entities/product/ui/ProductCardSkeleton'

export function ProductListSkeleton() {
  return (
    <ul className="my-2 grid grid-cols-2 gap-2 px-2">
      <li>
        <ProductCardSkeleton className="h-52 w-full" />
      </li>
      <li>
        <ProductCardSkeleton className="h-52 w-full" />
      </li>
      <li>
        <ProductCardSkeleton className="h-52 w-full" />
      </li>
      <li>
        <ProductCardSkeleton className="h-52 w-full" />
      </li>
    </ul>
  )
}
