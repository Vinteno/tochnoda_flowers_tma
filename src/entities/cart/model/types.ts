export interface CartItem {
  product_id: number
  name: string
  slug: string
  sku: string | null
  price: number
  best_price: number
  quantity: number
  thumbnail: string | null
  line_total?: number
}

export interface CartTotals {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
}
