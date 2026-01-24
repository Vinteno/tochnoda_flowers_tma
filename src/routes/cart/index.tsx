import { CartPage } from '@pages/cart'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart/')({
  component: CartPage,
})
