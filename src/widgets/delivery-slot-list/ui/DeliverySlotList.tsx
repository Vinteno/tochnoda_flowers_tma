import type { DeliverySlot } from '@entities/delivery'
import { DeliverySlotCard, useTimeSlots } from '@entities/delivery'
import { Label } from '@/components/ui/label'
import { DeliverySlotListSkeleton } from './DeliverySlotListSkeleton'

interface DeliverySlotListProps {
  selectedDate: string | null
  selectedSlot: { id: number, type: string } | null
  onSelect: (slot: DeliverySlot) => void
}

export function DeliverySlotList({
  selectedDate,
  selectedSlot,
  onSelect,
}: DeliverySlotListProps) {
  const { data: timeSlotsResponse, isLoading } = useTimeSlots(selectedDate)
  const slots = timeSlotsResponse?.slots
  const reason = timeSlotsResponse?.reason

  if (!selectedDate) {
    return null
  }

  if (isLoading) {
    return <DeliverySlotListSkeleton />
  }

  if (!slots || slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Нет доступных слотов на выбранную дату</p>
    )
  }

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <Label>Время доставки</Label>
      {reason && (
        <span className="text-xs text-muted-foreground">{reason}</span>
      )}
      <ol className="grid w-full grid-cols-2 gap-1">
        {slots.map(slot => (
          <li key={`${slot.type}-${slot.id}`}>
            <DeliverySlotCard
              slot={slot}
              selected={selectedSlot?.id === slot.id && selectedSlot?.type === slot.type}
              onSelect={() => onSelect(slot)}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
