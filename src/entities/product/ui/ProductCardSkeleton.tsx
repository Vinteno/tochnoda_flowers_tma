import type { ComponentProps } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared'

export function ProductCardSkeleton({ className, ...props }: ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton className={cn('rounded-md', className)} {...props} />
  )
}
