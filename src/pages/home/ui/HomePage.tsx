import { useProducts } from '@entities/product'
import { useDebounce } from '@uidotdev/usehooks'
import { CategoryFilter } from '@widgets/category-filter'
import { ProductList } from '@widgets/product-list'
import { useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { ButtonGroup } from '@/components/ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()

  const { data: productsData, isLoading: productsLoading } = useProducts({
    category: selectedCategory,
    search: debouncedSearch || undefined,
    per_page: 20,
  })

  return (
    <>
      <div className="mt-4 px-2">
        <div className="
          h-48 w-full rounded-2xl bg-radial-[at_80%_20%] from-primary/50
          to-primary
        "
        >
        </div>
      </div>

      <section className="mt-3 flex flex-col">
        <div className="sticky top-0 rounded-b-xl bg-background p-2">
          <ButtonGroup className="w-full [--radius:9999rem]">
            <ButtonGroup className="w-full">
              <InputGroup className="h-11 w-full border-0 bg-card">
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
    </>
  )
}
