import type { DeliverySlot } from '../model/types'
import { Button } from '@/components/ui/button'

interface DeliverySlotCardProps {
  slot: DeliverySlot
  selected?: boolean
  onSelect?: () => void
}

export function DeliverySlotCard({ slot, selected, onSelect }: DeliverySlotCardProps) {
  return (
    <Button
      type="button"
      className="h-auto w-full px-3 py-2 font-normal"
      variant={selected ? 'default' : 'secondary'}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center">
        <span>{slot.name}</span>
        <span className="text-xs opacity-80">
          {slot.start_time}
          {' '}
          -
          {' '}
          {slot.end_time}
        </span>
      </div>
    </Button>
  )
}
