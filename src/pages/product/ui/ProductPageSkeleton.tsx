import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductPageSkeleton() {
  return (
    <>
      <div className="mt-4 px-2">
        <Skeleton className="h-96 rounded-xl" />
      </div>
      <ScrollArea className="mt-2 rounded-xl px-2">
        <ul className="flex gap-1">
          <li>
            <Skeleton className="size-20 rounded-xl" />
          </li>
          <li>
            <Skeleton className="size-20 rounded-xl" />
          </li>
          <li>
            <Skeleton className="size-20 rounded-xl" />
          </li>
          <li>
            <Skeleton className="size-20 rounded-xl" />
          </li>
        </ul>
        <ScrollBar orientation="horizontal" className="-mb-2.5 h-1.5" />
      </ScrollArea>
      <div className="mt-5 flex flex-col px-2 pb-2">
        <Skeleton className="h-7 w-48 rounded-full" />
        <Skeleton className="mt-2 h-7 w-32 rounded-full" />
        <div className="mt-4 flex flex-col gap-1.5">
          <Skeleton className="h-5 w-42 rounded-full" />
          <Skeleton className="h-4 w-64 rounded-full" />
        </div>
      </div>
    </>
  )
}
