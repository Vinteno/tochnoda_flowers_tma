import { PickupPointCardList, usePickupPoints } from '@entities/delivery'
import { Label } from '@/components/ui/label'

interface PickupPointSelectorProps {
  selectedId?: number
  onSelect: (id: number) => void
}

export function PickupPointSelector({
  selectedId,
  onSelect,
}: PickupPointSelectorProps) {
  const { data: pickupPoints, isLoading: pickupPointsLoading } = usePickupPoints()

  return (
    <div className="flex flex-col gap-2">
      <Label>Пункт самовывоза</Label>
      <PickupPointCardList
        points={pickupPoints}
        isLoading={pickupPointsLoading}
        selectedId={selectedId}
        onSelect={onSelect}
        emptyMessage="Пункты самовывоза не настроены"
      />
    </div>
  )
}
