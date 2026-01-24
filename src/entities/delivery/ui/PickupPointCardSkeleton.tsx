import type { ComponentProps } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared'

export function PickupPointCardSkeleton({ className, ...props }: ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton className={cn('h-16 rounded-md px-2 py-1.5', className)} {...props} />
  )
}
