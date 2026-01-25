import type { ApiResponse } from '@shared/api'
import type {
  DeliveryDatesResponse,
  DeliveryFeesData,
  DeliverySlotsResponse,
  PickupPoint,
} from '../model/types'
import { apiClient } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

export function useDeliveryDates(days: number = 7) {
  return useQuery({
    queryKey: ['delivery', 'dates', days],
    queryFn: async () => {
      const response = await apiClient.get<DeliveryDatesResponse>(`/delivery/dates?days=${days}`)
      return response.data
    },
  })
}

export function useTimeSlots(date: string | null) {
  return useQuery({
    queryKey: ['delivery', 'time-slots', date],
    queryFn: async () => {
      if (!date) {
        return null
      }
      const response = await apiClient.get<DeliverySlotsResponse>(`/delivery/time-slots?date=${date}`)
      return response
    },
    enabled: !!date,
  })
}

export function usePickupPoints() {
  return useQuery({
    queryKey: ['delivery', 'pickup-points'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PickupPoint[]>>('/delivery/pickup-points')
      return response.data
    },
  })
}

export function useDeliveryFees(subtotal: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['delivery', 'fees', subtotal],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<DeliveryFeesData>>(
        `/delivery/fees?subtotal=${subtotal}`,
      )
      return response.data
    },
    enabled: enabled && subtotal > 0,
  })
}
