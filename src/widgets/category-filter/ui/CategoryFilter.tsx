import type { Category } from '@entities/category'
import { useCategories } from '@entities/category'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { CategoryFilterSkeleton } from './CategoryFilterSkeleton'

interface CategoryFilterProps {
  selectedCategory: string | undefined
  onCategoryChange: (category: string | undefined) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <CategoryFilterSkeleton />
    )
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <ScrollArea className="
      relative mt-3
      before:absolute before:inset-y-0 before:-left-2 before:z-10 before:h-full
      before:w-8 before:bg-linear-to-r before:from-background
      before:to-transparent
      after:absolute after:inset-y-0 after:-right-2 after:z-10 after:h-full
      after:w-8 after:bg-linear-to-l after:from-background after:to-transparent
    "
    >
      <ul className="flex gap-2">
        {categories.map((cat: Category) => (
          <li key={cat.id}>
            <Button
              variant={selectedCategory === cat.slug ? 'default' : 'outline'}
              className="h-7 border-border! font-normal"
              onClick={() => onCategoryChange(cat.slug === selectedCategory ? undefined : cat.slug)}
            >
              {cat.name}
            </Button>
          </li>
        ))}
      </ul>
      <ScrollBar orientation="horizontal" className="-mb-2 h-1" />
    </ScrollArea>
  )
}
