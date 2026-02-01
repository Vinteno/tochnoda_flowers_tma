import type { DeliveryDate } from '@entities/delivery'
import { useDeliveryDates } from '@entities/delivery'
import { useEffect, useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateForDisplay, formatDateToString } from '@/shared/lib/formatters'
import { DeliveryDateSelectorSkeleton } from './DeliveryDateSelectorSkeleton'

interface DeliveryDateSelectorProps {
  selectedDate: string | null
  onSelectDate: (date: string) => void
  days?: number
}

export function DeliveryDateSelector({
  selectedDate,
  onSelectDate,
  days = 14,
}: DeliveryDateSelectorProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const { data: dates, isLoading } = useDeliveryDates(days)

  // Auto-select first available date
  useEffect(() => {
    if (dates && !selectedDate) {
      const firstAvailable = dates.find((d: DeliveryDate) => d.is_available)
      if (firstAvailable) {
        onSelectDate(firstAvailable.date)
      }
    }
  }, [dates, selectedDate, onSelectDate])

  if (isLoading) {
    return <DeliveryDateSelectorSkeleton />
  }

  if (!dates || dates.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <Label htmlFor="delivery-date">Дата доставки</Label>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            id="delivery-date"
            variant="outline"
            className="
              w-full justify-between border border-border! bg-transparent
              font-normal
            "
          >
            {formatDateForDisplay(selectedDate)}
            <LuChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
            onSelect={(date) => {
              if (date) {
                const dateString = formatDateToString(date)
                const deliveryDate = dates.find((d: DeliveryDate) => d.date === dateString)
                if (deliveryDate?.is_available) {
                  onSelectDate(dateString)
                  setCalendarOpen(false)
                }
              }
            }}
            disabled={(date) => {
              const dateString = formatDateToString(date)
              const deliveryDate = dates.find((d: DeliveryDate) => d.date === dateString)
              return !deliveryDate?.is_available
            }}
            modifiers={{
              unavailable: (date) => {
                const dateString = formatDateToString(date)
                const deliveryDate = dates.find((d: DeliveryDate) => d.date === dateString)
                return !deliveryDate?.is_available
              },
            }}
            modifiersClassNames={{
              unavailable: 'opacity-50',
            }}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
