import type { ApiResponse } from '@shared/api'
import type { Promotion, PromoValidationResponse } from '../model/types'
import { apiClient } from '@shared/api'
import { useMutation, useQuery } from '@tanstack/react-query'

export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Promotion[]>>('/promotions')
      return response.data
    },
  })
}

export function useFeaturedPromotion() {
  return useQuery({
    queryKey: ['promotions', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Promotion>>('/promotions/featured')
      return response.data
    },
  })
}

export function useValidatePromo() {
  return useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string, orderTotal: number }) => {
      const response = await apiClient.post<PromoValidationResponse>('/promo/validate', {
        code,
        order_total: orderTotal,
      })
      return response
    },
  })
}
