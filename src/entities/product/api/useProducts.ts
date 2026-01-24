import type { PaginatedResponse } from '@shared/api'
import type { Product, ProductFilters } from '../model/types'
import { apiClient } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (filters?.category) {
        params.set('category', filters.category)
      }
      if (filters?.search) {
        params.set('search', filters.search)
      }
      if (filters?.min_price) {
        params.set('min_price', filters.min_price.toString())
      }
      if (filters?.max_price) {
        params.set('max_price', filters.max_price.toString())
      }
      if (filters?.sort) {
        params.set('sort', filters.sort)
      }
      if (filters?.per_page) {
        params.set('per_page', filters.per_page.toString())
      }
      if (filters?.page) {
        params.set('page', filters.page.toString())
      }

      const queryString = params.toString()
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`

      return apiClient.get<PaginatedResponse<Product>>(endpoint)
    },
  })
}
