import type { ImageSet, ImageWithPreview } from '@shared/lib'

export interface ProductImage extends ImageWithPreview {
  id: number
  is_thumbnail: boolean
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  best_price: number
  has_discount: boolean
  stock_quantity: number
  is_active: boolean
  sku: string | null
  thumbnail: ImageSet | null
  images: ProductImage[]
  category: import('@entities/category').Category | null
  metadata: Record<string, unknown> | null
  related_products?: RelatedProduct[]
  created_at: string
  updated_at: string
}

export interface RelatedProduct {
  id: number
  name: string
  slug: string
  price: number
  best_price: number
  thumbnail: ImageSet | null
}

export interface ProductFilters {
  category?: string
  search?: string
  min_price?: number
  max_price?: number
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'
  per_page?: number
  page?: number
}
