import { CheckoutPage } from '@pages/checkout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout/')({
  component: CheckoutPage,
})
