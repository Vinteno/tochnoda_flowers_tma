import type { DeliverySlot } from '@entities/delivery'
import type { CreateOrderData } from '@entities/order'
import { useCreateOrder } from '@entities/order'
import { useAuthStore } from '@features/auth'
import { useCartStore } from '@features/cart'
import { formatPrice, useBackButton } from '@shared/lib'
import { Link, useNavigate } from '@tanstack/react-router'
import { DeliveryDateSelector } from '@widgets/delivery-date-selector'
import { DeliverySlotList } from '@widgets/delivery-slot-list'
import { PickupPointSelector } from '@widgets/pickup-point-selector'
import { useCallback, useState } from 'react'
import { LuLoaderCircle, LuWallet } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { total, clear: clearCart } = useCartStore()
  const { user } = useAuthStore()
  const createOrder = useCreateOrder({
    onSuccess: (data) => {
      clearCart()
      navigate({
        to: '/order/result',
        search: {
          status: 'success',
          orderId: data.uuid || '',
        },
      })
    },
    onError: () => {
      navigate({
        to: '/order/result',
        search: {
          status: 'error',
          orderId: '',
        },
      })
    },
  })

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    notes: '',
    pickupPointId: 0,
    recipientName: '',
    recipientPhone: '',
    isRecipientDifferent: false,
  })

  // Reset slot when date changes
  const handleDateChange = useCallback((date: string | null) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }, [])

  const handleBack = useCallback(() => {
    navigate({ to: '/cart' })
  }, [navigate])

  useBackButton(handleBack)

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const orderData: CreateOrderData = {
      customer_name: formData.name,
      customer_phone: formData.phone || undefined,
      delivery_type: deliveryType,
      notes: formData.notes || undefined,
    }

    if (deliveryType === 'delivery') {
      orderData.shipping_address = {
        street: formData.address,
        city: '',
        zip: '',
      }
      orderData.delivery_date = selectedDate || undefined
      orderData.delivery_slot_id = selectedSlot?.id
      orderData.delivery_slot_type = selectedSlot?.type

      if (formData.isRecipientDifferent) {
        orderData.recipient_name = formData.recipientName
        orderData.recipient_phone = formData.recipientPhone
      }
    }
    else {
      orderData.pickup_point_id = formData.pickupPointId || undefined
    }

    try {
      await createOrder.mutateAsync(orderData)
    }
    catch {
      // Error handled by mutation
    }
  }

  return (
    <>
      <section className="mt-4 flex-1 px-2 pb-2">
        <Tabs value={deliveryType} onValueChange={v => setDeliveryType(v as 'pickup' | 'delivery')}>
          <TabsList className="w-full rounded-xl bg-card">
            <TabsTrigger
              value="pickup"
              className="
                transition-all
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
              "
            >
              Самовывоз
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              className="
                transition-all
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
              "
            >
              Доставка
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="pickup"
            className="rounded-xl bg-card px-2 pt-1.5 pb-2"
          >
            <form className="mt-2 flex flex-col gap-4" onSubmit={handleSubmit}>
              <Label className="flex flex-col items-start gap-2">
                Имя
                <Input
                  placeholder="Иванов Иван"
                  className="text-sm font-normal"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  required
                />
              </Label>
              <Label className="flex flex-col items-start gap-2">
                Телефон
                <PhoneInput
                  className="
                    w-full font-normal
                    [&>input]:text-sm!
                  "
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={val => handleInputChange('phone', val)}
                />
              </Label>

              <PickupPointSelector
                selectedId={formData.pickupPointId}
                onSelect={id => handleInputChange('pickupPointId', id)}
              />

              <Label className="flex flex-col items-start gap-2">
                Комментарий
                <Textarea
                  placeholder="Добавить записку с содержанием..."
                  className="text-sm font-normal"
                  value={formData.notes}
                  onChange={e => handleInputChange('notes', e.target.value)}
                />
              </Label>
            </form>
          </TabsContent>

          <TabsContent
            value="delivery"
            className="rounded-xl bg-card px-2 pt-1.5 pb-2"
          >
            <form className="mt-2 flex flex-col gap-4" onSubmit={handleSubmit}>
              <Label className="flex flex-col items-start gap-2">
                Имя
                <Input
                  placeholder="Иванов Иван"
                  className="text-sm font-normal"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  required
                />
              </Label>
              <Label className="flex flex-col items-start gap-2">
                Телефон
                <PhoneInput
                  className="
                    w-full font-normal
                    [&>input]:text-sm!
                  "
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={val => handleInputChange('phone', val)}
                />
              </Label>

              <Label className="flex flex-col items-start gap-2">
                Адрес доставки
                <Input
                  placeholder="ул. Галеева, д. 6"
                  className="text-sm font-normal"
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  required
                />
              </Label>

              <div className="flex items-center gap-2">
                <Switch
                  id="differentRecipient"
                  checked={formData.isRecipientDifferent}
                  onCheckedChange={checked => handleInputChange('isRecipientDifferent', checked)}
                />
                <Label
                  htmlFor="differentRecipient"
                  className="cursor-pointer text-sm"
                >
                  Получатель - другой человек
                </Label>
              </div>

              {formData.isRecipientDifferent && (
                <>
                  <Label className="flex flex-col items-start gap-2">
                    Имя получателя
                    <Input
                      placeholder="Иванов Иван"
                      className="text-sm font-normal"
                      value={formData.recipientName}
                      onChange={e => handleInputChange('recipientName', e.target.value)}
                    />
                  </Label>
                  <Label className="flex flex-col items-start gap-2">
                    Телефон получателя
                    <PhoneInput
                      className="
                        w-full font-normal
                        [&>input]:text-sm!
                      "
                      placeholder="+7 (999) 123-45-67"
                      value={formData.recipientPhone}
                      onChange={val => handleInputChange('recipientPhone', val)}
                    />
                  </Label>
                </>
              )}

              {/* Date Selection */}
              <DeliveryDateSelector
                selectedDate={selectedDate}
                onSelectDate={handleDateChange}
              />

              {/* Time Slot Selection */}
              <DeliverySlotList
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
              />

              <Label className="flex flex-col items-start gap-2">
                Комментарий
                <Textarea
                  placeholder="Добавить записку с содержанием..."
                  className="text-sm font-normal"
                  value={formData.notes}
                  onChange={e => handleInputChange('notes', e.target.value)}
                />
              </Label>
            </form>
          </TabsContent>
        </Tabs>
      </section>

      <footer className="
        sticky bottom-0 flex w-full flex-col gap-2 rounded-t-3xl bg-background
        p-2
      "
      >
        <Button
          className="h-11 w-full justify-between rounded-full text-base"
          onClick={handleSubmit}
          disabled={createOrder.isPending}
        >
          <div className="flex items-center gap-2">
            {createOrder.isPending
              ? (
                  <LuLoaderCircle className="animate-spin" />
                )
              : <LuWallet />}
            Оплатить
          </div>
          <p>{formatPrice(total)}</p>
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Нажимая кнопку, вы принимаете
          {' '}
          <Link
            to="/documents/user-agreement"
            className="text-primary underline"
          >
            Пользовательское соглашение
          </Link>
          {' '}
          и
          {' '}
          <Link
            to="/documents/privacy-policy"
            className="text-primary underline"
          >
            Политику обработки персональных данных
          </Link>
          .
        </p>
      </footer>
    </>
  )
}
