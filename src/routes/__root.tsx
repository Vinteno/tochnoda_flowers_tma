import { useAuthStore } from '@features/auth'
import { useCartStore } from '@features/cart'
import { createRootRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { PageLayout } from '@/app/layouts/PageLayout'

function RootLayout() {
  const { ensureValidToken } = useAuthStore()
  const { fetchFromServer } = useCartStore()
  const isInitialized = useRef(false)

  useEffect(() => {
    // Only run once on app load
    if (isInitialized.current) {
      return
    }
    isInitialized.current = true

    // Authenticate on app load
    ensureValidToken().then((didResetCart) => {
      if (!didResetCart) {
        // After auth, fetch cart from server
        fetchFromServer()
      }
    })
  }, [ensureValidToken, fetchFromServer])

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
