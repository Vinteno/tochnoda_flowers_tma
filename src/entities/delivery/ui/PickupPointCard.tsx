import type { PickupPoint } from '../model/types'
import { Button } from '@/components/ui/button'

interface PickupPointCardProps {
  point: PickupPoint
  selected?: boolean
  onSelect?: () => void
}

export function PickupPointCard({ point, selected, onSelect }: PickupPointCardProps) {
  return (
    <Button
      type="button"
      variant={selected ? 'default' : 'secondary'}
      className="h-auto justify-start px-2 py-1.5"
      onClick={onSelect}
    >
      <div className="flex flex-col items-start text-left">
        <span className="font-medium">{point.name}</span>
        <span className="text-xs opacity-80">{point.address}</span>
        {point.working_hours && (
          <span className="text-xs opacity-60">{point.working_hours}</span>
        )}
      </div>
    </Button>
  )
}
