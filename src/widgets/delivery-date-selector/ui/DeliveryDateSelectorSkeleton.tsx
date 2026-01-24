import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export function DeliveryDateSelectorSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <Label htmlFor="delivery-date">Дата доставки</Label>
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  )
}
