import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPolicyPage } from '@/pages/documents'

export const Route = createFileRoute('/documents/privacy-policy/')({
  component: PrivacyPolicyPage,
})
