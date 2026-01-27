import { z } from 'zod'

export const checkoutSchema = z.object({
  delivery_type: z.enum(['pickup', 'delivery']),
  customer_name: z.string().min(1, 'Введите имя').max(255),
  customer_phone: z.string().max(50).optional(),
  notes: z.string().max(1000).optional(),

  // Pickup fields
  pickup_point_id: z.number().optional(),

  // Delivery fields
  shipping_address: z.object({
    street: z.string().max(255).optional(),
    city: z.string().max(255).optional(),
    zip: z.string().max(50).optional(),
  }).optional(),
  delivery_date: z.string().optional(),
  delivery_slot_id: z.number().optional(),
  delivery_slot_type: z.enum(['regular', 'override']).optional(),
  is_recipient_different: z.boolean().optional(),
  recipient_name: z.string().max(255).optional(),
  recipient_phone: z.string().max(50).optional(),
}).superRefine((data, ctx) => {
  if (data.delivery_type === 'pickup') {
    if (!data.pickup_point_id || data.pickup_point_id < 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Выберите пункт самовывоза',
        path: ['pickup_point_id'],
      })
    }
  }

  if (data.delivery_type === 'delivery') {
    if (!data.shipping_address?.street?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Укажите улицу и дом',
        path: ['shipping_address', 'street'],
      })
    }

    if (!data.delivery_date) {
      ctx.addIssue({
        code: 'custom',
        message: 'Укажите дату доставки',
        path: ['delivery_date'],
      })
    }

    if (!data.delivery_slot_id) {
      ctx.addIssue({
        code: 'custom',
        message: 'Выберите время доставки',
        path: ['delivery_slot_id'],
      })
    }

    if (!data.delivery_slot_type) {
      ctx.addIssue({
        code: 'custom',
        message: 'Укажите тип слота',
        path: ['delivery_slot_type'],
      })
    }

    if (data.is_recipient_different) {
      if (!data.recipient_name?.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Укажите имя получателя',
          path: ['recipient_name'],
        })
      }

      if (!data.recipient_phone?.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Укажите телефон получателя',
          path: ['recipient_phone'],
        })
      }
    }
  }
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
