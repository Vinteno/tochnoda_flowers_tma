import { createFileRoute } from '@tanstack/react-router'
import { UserAgreementPage } from '@/pages/documents'

export const Route = createFileRoute('/documents/user-agreement/')({
  component: UserAgreementPage,
})
