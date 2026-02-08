import { useProducts } from '@entities/product'
import { usePromotions } from '@entities/promotion'
import { getImageSources } from '@shared/lib'
import { ResponsiveImage } from '@shared/ui'
import { useDebounce } from '@uidotdev/usehooks'
import { BottomNav } from '@widgets/bottom-nav'
import { CategoryFilter } from '@widgets/category-filter'
import { ProductList } from '@widgets/product-list'
import { useMemo, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { ButtonGroup } from '@/components/ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()

  const { data: promotionsData } = usePromotions()
  const { data: productsData, isLoading: productsLoading } = useProducts({
    category: selectedCategory,
    search: debouncedSearch || undefined,
    per_page: 20,
  })

  const featuredBanner = useMemo(() => {
    const items = promotionsData ?? []
    const promotion = items
      .filter(promotion => Boolean(promotion.banner?.original || promotion.banner?.small))
      .sort((a, b) => {
        const aStartsAt = a.starts_at ? Date.parse(a.starts_at) : Number.NEGATIVE_INFINITY
        const bStartsAt = b.starts_at ? Date.parse(b.starts_at) : Number.NEGATIVE_INFINITY
        return bStartsAt - aStartsAt
      })[0]
    if (!promotion?.banner) {
      return null
    }
    return { promotion, banner: promotion.banner }
  }, [promotionsData])

  const bannerSources = featuredBanner?.banner
    ? getImageSources(featuredBanner.banner, 'banner')
    : null

  return (
    <>
      {featuredBanner && bannerSources?.fallbackSrc && (
        <div className="mt-4 px-2">
          <ResponsiveImage
            image={featuredBanner.banner}
            mode="banner"
            sources={bannerSources}
            className="h-48 w-full rounded-2xl object-cover"
            alt={featuredBanner.promotion.name}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={400}
            height={192}
            sizes="100vw"
          />
        </div>
      )}

      <section className="relative mt-4 flex flex-col">
        <div className="rounded-b-xl bg-background px-2 pb-2">
          <ButtonGroup className="w-full">
            <ButtonGroup className="w-full">
              <InputGroup className="h-10 w-full border-border!">
                <InputGroupInput
                  className="text-sm"
                  placeholder="Поиск по каталогу..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="submit"
                    className="size-8"
                  >
                    <LuSearch className="size-4" strokeWidth={1.5} />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </ButtonGroup>
          </ButtonGroup>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <ProductList
          products={productsData?.data}
          isLoading={productsLoading}
        />
      </section>

      <BottomNav active="home" />
    </>
  )
}
