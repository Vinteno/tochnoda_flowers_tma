export interface DeliverySlot {
  id: number
  type: 'regular' | 'override'
  name: string
  start_time: string
  end_time: string
  label: string
}

export interface DeliveryDate {
  date: string
  day_name: string
  is_available: boolean
  slots_count: number
  is_override?: boolean
  reason?: string | null
}

export interface DeliverySlotsResponse {
  date: string
  is_available: boolean
  is_override: boolean
  reason: string | null
  slots: DeliverySlot[]
}

export interface DeliveryDatesResponse {
  data: DeliveryDate[]
}

export interface PickupPoint {
  id: number
  name: string
  address: string
  phone: string | null
  working_hours: string | null
  is_active: boolean
}

export interface DeliveryFeeRule {
  min_order_amount: number
  delivery_fee: number
}

export interface DeliveryFeesData {
  rules: DeliveryFeeRule[]
  resolved_fee: number
}

// Legacy support
export interface TimeSlot {
  label: string
  value: string
}

export interface TimeSlotsResponse {
  time_slots: TimeSlot[]
}
