import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export function CategoryFilterSkeleton() {
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
        <li>
          <Skeleton className="h-7 w-24 rounded-md" />
        </li>
        <li>
          <Skeleton className="h-7 w-24 rounded-md" />
        </li>
        <li>
          <Skeleton className="h-7 w-24 rounded-md" />
        </li>
        <li>
          <Skeleton className="h-7 w-24 rounded-md" />
        </li>
      </ul>
      <ScrollBar orientation="horizontal" className="-mb-2.5 h-1.5" />
    </ScrollArea>
  )
}
