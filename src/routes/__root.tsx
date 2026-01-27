import { getPendingOrder } from '@entities/order'
import { useAuthStore } from '@features/auth'
import { useCartStore } from '@features/cart'
import { createRootRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { PageLayout } from '@/app/layouts/PageLayout'

function RootLayout() {
  const { ensureValidToken } = useAuthStore()
  const { fetchFromServer } = useCartStore()
  const navigate = useNavigate()
  const isInitialized = useRef(false)

  useEffect(() => {
    // Only run once on app load
    if (isInitialized.current) {
      return
    }
    isInitialized.current = true

    // Check for pending order and redirect if exists
    const pendingOrder = getPendingOrder()
    if (pendingOrder) {
      navigate({
        to: '/order/result',
        search: {
          status: 'pending',
          orderId: pendingOrder.uuid,
        },
      })
    }

    // Authenticate on app load
    ensureValidToken().then((didResetCart) => {
      if (!didResetCart) {
        // After auth, fetch cart from server
        fetchFromServer()
      }
    })
  }, [ensureValidToken, fetchFromServer, navigate])

  return (
    <>
      <PageLayout />
      {/* <TanStackRouterDevtools /> */}
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
