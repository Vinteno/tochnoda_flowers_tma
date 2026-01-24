import { DeliverySlotCardSkeleton } from '@entities/delivery/ui/DeliverySlotCardSkeleton'
import { Label } from '@/components/ui/label'

export function DeliverySlotListSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <Label>Время доставки</Label>
      <ol className="grid w-full grid-cols-2 gap-1">
        <li>
          <DeliverySlotCardSkeleton />
        </li>
        <li>
          <DeliverySlotCardSkeleton />
        </li>
        <li>
          <DeliverySlotCardSkeleton />
        </li>
        <li>
          <DeliverySlotCardSkeleton />
        </li>
      </ol>
    </div>
  )
}
