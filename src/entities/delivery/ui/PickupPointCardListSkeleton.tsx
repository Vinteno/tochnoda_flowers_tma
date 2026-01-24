import { PickupPointCardSkeleton } from './PickupPointCardSkeleton'

export function PickupPointCardListSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <PickupPointCardSkeleton />
      <PickupPointCardSkeleton />
      <PickupPointCardSkeleton />
    </div>
  )
}
