import type { ApiResponse } from '@shared/api'
import type { Product } from '../model/types'
import { apiClient } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`)
      return response.data
    },
    enabled: !!slug,
  })
}
