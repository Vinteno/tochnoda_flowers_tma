export interface OrderItem {
  id: number
  product_id: number | null
  product_name: string
  product_sku: string | null
  price: number
  quantity: number
  total: number
}

export interface ShippingAddress {
  street: string
  city: string
  zip: string
}

export interface Order {
  id: number
  uuid: string
  status: OrderStatus
  payment_status: PaymentStatus
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  recipient_name: string | null
  recipient_phone: string | null
  shipping_address: ShippingAddress | null
  delivery_type: 'delivery' | 'pickup'
  delivery_date: string | null
  delivery_time_slot: string | null
  pickup_point_id: number | null
  notes: string | null
  subtotal: number
  discount: number
  total: number
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'ready' | 'delivering' | 'completed' | 'cancelled'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'

export interface Payment {
  payment_id: number
  status: PaymentStatus
  confirmation_url: string
  external_id: string
  gateway: string
}

export type CreateOrderResponse = Order & {
  payment?: Payment
}

export interface CreateOrderData {
  customer_name: string
  customer_email?: string
  customer_phone?: string
  delivery_type: 'delivery' | 'pickup'
  delivery_date?: string
  delivery_slot_id?: number
  delivery_slot_type?: 'regular' | 'override'
  shipping_address?: ShippingAddress
  recipient_name?: string
  recipient_phone?: string
  pickup_point_id?: number
  notes?: string
}
