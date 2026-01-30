export interface Promotion {
  id: number
  name: string
  slug: string
  description: string | null
  code: string | null
  banner_url?: string | null
  discount_type: 'percentage' | 'fixed' | 'final_price'
  discount_value: number
  min_order_amount: number | null
  starts_at: string | null
  ends_at: string | null
}

export interface PromoValidationResponse {
  valid: boolean
  promotion?: Promotion
}
