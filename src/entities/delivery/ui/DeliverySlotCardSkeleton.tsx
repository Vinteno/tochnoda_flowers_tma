import type { ComponentProps } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared'

export function DeliverySlotCardSkeleton({ className, ...props }: ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton className={cn('h-13 rounded-md px-3 py-2', className)} {...props} />
  )
}
