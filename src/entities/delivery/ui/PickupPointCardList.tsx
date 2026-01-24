import type { PickupPoint } from '../model/types'
import { PickupPointCard } from './PickupPointCard'
import { PickupPointCardListSkeleton } from './PickupPointCardListSkeleton'

interface PickupPointCardListProps {
  points: PickupPoint[] | undefined
  isLoading: boolean
  selectedId?: number
  onSelect: (id: number) => void
  emptyMessage?: string
}

export function PickupPointCardList({
  points,
  isLoading,
  selectedId,
  onSelect,
  emptyMessage = 'Пункты самовывоза не настроены',
}: PickupPointCardListProps) {
  if (isLoading) {
    return <PickupPointCardListSkeleton />
  }

  if (!points || points.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {points.map(point => (
        <PickupPointCard
          key={point.id}
          point={point}
          selected={selectedId === point.id}
          onSelect={() => onSelect(point.id)}
        />
      ))}
    </div>
  )
}
