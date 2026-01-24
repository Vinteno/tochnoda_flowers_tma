import { createFileRoute } from '@tanstack/react-router'
import { AdvertisingMessagesPage } from '@/pages/documents'

export const Route = createFileRoute('/documents/advertising-messages/')({
  component: AdvertisingMessagesPage,
})
