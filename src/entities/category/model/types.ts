export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  products_count?: number
}
