import type { ApiResponse } from '@shared/api'
import type { CreateOrderData, CreateOrderResponse, Order } from '../model/types'
import { apiClient, queryClient } from '@shared/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { openLink, retrieveLaunchParams } from '@tma.js/sdk-react'

const PENDING_ORDER_KEY = 'pending_order'

export interface PendingOrder {
  uuid: string
  confirmationUrl: string
  createdAt: number
}

function isIOSPlatform(): boolean {
  try {
    return retrieveLaunchParams().tgWebAppPlatform === 'ios'
  }
  catch {
    return false
  }
}

/**
 * Saves pending order to localStorage for tracking payment status
 */
export function savePendingOrder(uuid: string, confirmationUrl: string): void {
  const pending: PendingOrder = {
    uuid,
    confirmationUrl,
    createdAt: Date.now(),
  }
  localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pending))
}

/**
 * Opens payment page for pending order
 */
export function openPaymentPage(url: string): void {
  openLink(url, { tryInstantView: !isIOSPlatform() })
}

/**
 * Gets pending order from localStorage
 */
export function getPendingOrder(): PendingOrder | null {
  const stored = localStorage.getItem(PENDING_ORDER_KEY)
  if (!stored) {
    return null
  }

  try {
    const pending = JSON.parse(stored) as PendingOrder
    // Expire after 1 hour
    const ONE_HOUR = 60 * 60 * 1000
    if (Date.now() - pending.createdAt > ONE_HOUR) {
      clearPendingOrder()
      return null
    }
    return pending
  }
  catch {
    clearPendingOrder()
    return null
  }
}

/**
 * Clears pending order from localStorage
 */
export function clearPendingOrder(): void {
  localStorage.removeItem(PENDING_ORDER_KEY)
}

export function useCreateOrder(options?: {
  onSuccess?: (data: CreateOrderResponse) => void
  onError?: (error: Error) => void
  onPaymentRedirect?: (data: CreateOrderResponse) => void
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
        // Payment required - save pending order and redirect
        savePendingOrder(data.uuid, confirmationUrl)

        // Notify that we're redirecting to payment
        options?.onPaymentRedirect?.(data)

        // Open payment page - user will return to app after payment
        if (!isIOSPlatform()) {
          openLink(confirmationUrl, {
            tryInstantView: true,
          })
        }

        // DO NOT call onSuccess here - payment hasn't completed yet
        return
      }

      // No payment required (free order or other payment method)
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
