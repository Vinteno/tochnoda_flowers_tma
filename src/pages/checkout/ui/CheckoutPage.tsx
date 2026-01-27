import type { DeliverySlot } from '@entities/delivery'
import type { CheckoutFormData, CreateOrderData } from '@entities/order'
import { useDeliveryFees } from '@entities/delivery'
import { checkoutSchema, useCreateOrder } from '@entities/order'
import { useAuthStore } from '@features/auth'
import { useCartStore } from '@features/cart'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatPrice, useBackButton } from '@shared/lib'
import { Link, useNavigate } from '@tanstack/react-router'
import { DeliveryDateSelector } from '@widgets/delivery-date-selector'
import { DeliverySlotList } from '@widgets/delivery-slot-list'
import { PickupPointSelector } from '@widgets/pickup-point-selector'
import { useCallback, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { LuLoaderCircle, LuWallet } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { subtotal, clear: clearCart } = useCartStore()
  const { user } = useAuthStore()
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      delivery_type: 'pickup',
      customer_name: user?.name || '',
      customer_phone: user?.phone || '',
      pickup_point_id: 0,
      notes: '',
      shipping_address: {
        street: '',
        city: '',
        zip: '',
      },
      delivery_date: '',
      delivery_slot_id: undefined,
      delivery_slot_type: undefined,
      is_recipient_different: false,
      recipient_name: '',
      recipient_phone: '',
    },
  })
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

  const deliveryType = useWatch({
    control: form.control,
    name: 'delivery_type',
  }) ?? 'pickup'
  const deliveryDate = useWatch({
    control: form.control,
    name: 'delivery_date',
  })
  const deliverySlotId = useWatch({
    control: form.control,
    name: 'delivery_slot_id',
  })
  const deliverySlotType = useWatch({
    control: form.control,
    name: 'delivery_slot_type',
  })
  const isRecipientDifferent = useWatch({
    control: form.control,
    name: 'is_recipient_different',
  })
  const { data: deliveryFees } = useDeliveryFees(subtotal, deliveryType === 'delivery')

  // Reset slot when date changes
  const handleDateChange = useCallback((date: string) => {
    form.setValue('delivery_date', date)
    form.setValue('delivery_slot_id', undefined)
    form.setValue('delivery_slot_type', undefined)
    void form.trigger(['delivery_date', 'delivery_slot_id', 'delivery_slot_type'])
  }, [form])

  const handleBack = useCallback(() => {
    navigate({ to: '/cart' })
  }, [navigate])

  useBackButton(handleBack)

  const handleDeliveryTypeChange = useCallback((value: 'pickup' | 'delivery') => {
    form.setValue('delivery_type', value)
    if (value === 'pickup') {
      // Clear delivery fields
      form.setValue('delivery_date', '')
      form.setValue('delivery_slot_id', undefined)
      form.setValue('delivery_slot_type', undefined)
      form.setValue('shipping_address', { street: '', city: '', zip: '' })
      form.setValue('is_recipient_different', false)
      form.setValue('recipient_name', '')
      form.setValue('recipient_phone', '')
    }
    else {
      // Clear pickup fields
      form.setValue('pickup_point_id', 0)
      form.setValue('is_recipient_different', false)
    }
    // Trigger full form validation after all values are set
    void form.trigger()
  }, [form])

  const deliveryFee = deliveryType === 'delivery'
    ? (deliveryFees?.resolved_fee ?? 0)
    : 0
  const totalWithDelivery = subtotal + deliveryFee

  const selectedSlot = useMemo(() => {
    if (!deliverySlotId || !deliverySlotType) {
      return null
    }
    return {
      id: deliverySlotId,
      type: deliverySlotType,
    } as { id: number, type: DeliverySlot['type'] }
  }, [deliverySlotId, deliverySlotType])

  const cleanOptional = (value: string | undefined) => {
    const trimmed = value?.trim()
    return trimmed || undefined
  }

  const handleSubmit = async (values: CheckoutFormData) => {
    const orderData: CreateOrderData = {
      customer_name: values.customer_name.trim(),
      customer_phone: cleanOptional(values.customer_phone),
      delivery_type: values.delivery_type,
      notes: cleanOptional(values.notes),
    }

    if (values.delivery_type === 'delivery') {
      orderData.shipping_address = {
        street: values.shipping_address?.street?.trim() || '',
        city: values.shipping_address?.city || '',
        zip: values.shipping_address?.zip || '',
      }
      orderData.delivery_date = values.delivery_date
      orderData.delivery_slot_id = values.delivery_slot_id
      orderData.delivery_slot_type = values.delivery_slot_type

      if (values.is_recipient_different) {
        orderData.recipient_name = cleanOptional(values.recipient_name)
        orderData.recipient_phone = cleanOptional(values.recipient_phone)
      }
    }
    else {
      orderData.pickup_point_id = values.pickup_point_id
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
      <section className="mt-4 flex-1 px-2 pb-28">
        <Form {...form}>
          <form id="checkout-form" className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <Tabs value={deliveryType} onValueChange={v => handleDeliveryTypeChange(v as 'pickup' | 'delivery')}>
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
            </Tabs>

            <div className="rounded-xl bg-card px-2 pt-1.5 pb-2">
              <div className="mt-2 flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Иванов Иван"
                          className="text-sm font-normal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон</FormLabel>
                      <FormControl>
                        <PhoneInput
                          className="
                            w-full font-normal
                            [&>input]:text-sm!
                          "
                          placeholder="+7 (999) 123-45-67"
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {deliveryType === 'pickup' && (
                  <>
                    <FormField
                      control={form.control}
                      name="pickup_point_id"
                      render={({ field }) => (
                        <FormItem>
                          <PickupPointSelector
                            selectedId={field.value}
                            onSelect={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Комментарий</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Добавить записку с содержанием..."
                              className="text-sm font-normal"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {deliveryType === 'delivery' && (
                  <>
                    <FormField
                      control={form.control}
                      name="shipping_address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Адрес доставки</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ул. Галеева, д. 6"
                              className="text-sm font-normal"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_recipient_different"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              id="differentRecipient"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor="differentRecipient"
                            className="cursor-pointer text-sm"
                          >
                            Получатель - другой человек
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isRecipientDifferent && (
                      <>
                        <FormField
                          control={form.control}
                          name="recipient_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя получателя</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Иванов Иван"
                                  className="text-sm font-normal"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="recipient_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Телефон получателя</FormLabel>
                              <FormControl>
                                <PhoneInput
                                  className="
                                    w-full font-normal
                                    [&>input]:text-sm!
                                  "
                                  placeholder="+7 (999) 123-45-67"
                                  value={field.value ?? ''}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="delivery_date"
                      render={({ field }) => (
                        <FormItem>
                          <DeliveryDateSelector
                            selectedDate={field.value || null}
                            onSelectDate={handleDateChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="delivery_slot_id"
                      render={() => (
                        <FormItem>
                          <DeliverySlotList
                            selectedDate={deliveryDate || null}
                            selectedSlot={selectedSlot}
                            onSelect={(slot) => {
                              // Set both values first, then trigger validation together
                              form.setValue('delivery_slot_id', slot.id)
                              form.setValue('delivery_slot_type', slot.type)
                              void form.trigger(['delivery_slot_id', 'delivery_slot_type'])
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Комментарий</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Добавить записку с содержанием..."
                              className="text-sm font-normal"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          </form>
        </Form>
      </section>

      <footer className="
        fixed right-0 bottom-0 left-0 flex w-full flex-col gap-2 rounded-t-3xl
        bg-background px-2 pt-2 safe-area-bottom
      "
      >
        <Button
          className="h-11 w-full justify-between rounded-full text-base"
          type="submit"
          form="checkout-form"
          disabled={createOrder.isPending || !form.formState.isValid}
        >
          <div className="flex items-center gap-2">
            {createOrder.isPending
              ? (
                  <LuLoaderCircle className="animate-spin" />
                )
              : <LuWallet />}
            Оплатить
          </div>
          <p>{formatPrice(totalWithDelivery)}</p>
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
