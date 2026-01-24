import { ProductPage } from '@pages/product'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/product/$slug')({
  component: ProductPageWrapper,
})

function ProductPageWrapper() {
  const { slug } = Route.useParams()
  return <ProductPage slug={slug} />
}
