export interface Customer {
  id: number
  name: string
  email: string | null
  phone: string | null
  telegram_id: string | null
}

export interface AuthResponse {
  token: string
  user: Customer
}
