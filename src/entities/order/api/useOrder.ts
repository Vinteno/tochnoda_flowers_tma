import type { ApiResponse } from '@shared/api'
import type { CreateOrderData, CreateOrderResponse, Order } from '../model/types'
import { apiClient, queryClient } from '@shared/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { openLink } from '@tma.js/sdk-react'

export function useCreateOrder(options?: {
  onSuccess?: (data: CreateOrderResponse) => void
  onError?: (error: Error) => void
}) {
  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const response = await apiClient.post<ApiResponse<CreateOrderResponse>>('/orders', data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      const confirmationUrl = data.payment?.confirmation_url
      if (confirmationUrl) {
        openLink(confirmationUrl, {
          tryInstantView: true,
        })
      }
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

export function useOrder(uuid: string) {
  return useQuery({
    queryKey: ['order', uuid],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${uuid}`)
      return response.data
    },
    enabled: !!uuid,
  })
}

export function useUserOrders() {
  return useQuery({
    queryKey: ['user', 'orders'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Order[]>>('/user/orders')
      return response.data
    },
  })
}
