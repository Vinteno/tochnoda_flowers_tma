import type { ApiResponse } from '@shared/api'
import type { Category } from '../model/types'
import { apiClient } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories')
      return response.data
    },
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`)
      return response.data
    },
    enabled: !!slug,
  })
}
