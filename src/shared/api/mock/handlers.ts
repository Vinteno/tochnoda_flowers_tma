import {
  filterTestProducts,
  getTestCategoryBySlug,
  getTestProductBySlug,
  testCategories,
  testDeliveryDates,
  testDeliverySlots,
  testFeaturedPromotion,
  testOrders,
  testPickupPoints,
  testPromotions,
} from './testData'

type MockHandler = (params: URLSearchParams, pathParams?: Record<string, string>) => unknown

interface RouteMatch {
  handler: MockHandler
  params?: Record<string, string>
}

// Simulated network delay (ms)
const MOCK_DELAY = 300

// Route pattern matching
const routes: Array<{ pattern: RegExp, handler: MockHandler }> = [
  // Products
  {
    pattern: /^\/products$/,
    handler: (params) => {
      const filters = {
        category: params.get('category') || undefined,
        search: params.get('search') || undefined,
        min_price: params.get('min_price') ? Number(params.get('min_price')) : undefined,
        max_price: params.get('max_price') ? Number(params.get('max_price')) : undefined,
        sort: params.get('sort') as 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | undefined,
        per_page: params.get('per_page') ? Number(params.get('per_page')) : undefined,
        page: params.get('page') ? Number(params.get('page')) : undefined,
      }
      return filterTestProducts(filters)
    },
  },
  {
    pattern: /^\/products\/([^/]+)$/,
    handler: (_params, pathParams) => {
      const product = getTestProductBySlug(pathParams?.slug || '')
      if (!product) {
        // eslint-disable-next-line no-throw-literal
        throw { status: 404, message: 'Product not found' }
      }
      return { data: product }
    },
  },

  // Categories
  {
    pattern: /^\/categories$/,
    handler: () => ({ data: testCategories }),
  },
  {
    pattern: /^\/categories\/([^/]+)$/,
    handler: (_params, pathParams) => {
      const category = getTestCategoryBySlug(pathParams?.slug || '')
      if (!category) {
        // eslint-disable-next-line no-throw-literal
        throw { status: 404, message: 'Category not found' }
      }
      return { data: category }
    },
  },

  // Delivery
  {
    pattern: /^\/delivery\/dates$/,
    handler: () => ({ data: testDeliveryDates }),
  },
  {
    pattern: /^\/delivery\/time-slots$/,
    handler: (params) => {
      const date = params.get('date')
      const deliveryDate = testDeliveryDates.find(d => d.date === date)
      return {
        date: date || '',
        is_available: deliveryDate?.is_available ?? false,
        is_override: deliveryDate?.is_override ?? false,
        reason: deliveryDate?.reason ?? null,
        slots: deliveryDate?.is_available ? testDeliverySlots : [],
      }
    },
  },
  {
    pattern: /^\/delivery\/pickup-points$/,
    handler: () => ({ data: testPickupPoints }),
  },
  {
    pattern: /^\/delivery\/fees$/,
    handler: (params) => {
      const rules = [
        { min_order_amount: 0, delivery_fee: 300 },
        { min_order_amount: 2000, delivery_fee: 0 },
      ]
      const subtotal = Number(params.get('subtotal')) || 0
      const resolvedRule = rules
        .filter(rule => subtotal >= rule.min_order_amount)
        .sort((a, b) => b.min_order_amount - a.min_order_amount)[0]
      return {
        data: {
          rules,
          resolved_fee: resolvedRule?.delivery_fee ?? rules[0]?.delivery_fee ?? 0,
        },
      }
    },
  },

  // Promotions
  {
    pattern: /^\/promotions$/,
    handler: () => ({ data: testPromotions }),
  },
  {
    pattern: /^\/promotions\/featured$/,
    handler: () => ({ data: testFeaturedPromotion }),
  },

  // Promo validation
  {
    pattern: /^\/promo\/validate$/,
    handler: () => null, // Handled in POST
  },

  // Orders
  {
    pattern: /^\/orders$/,
    handler: () => null, // Handled in POST
  },
  {
    pattern: /^\/orders\/([^/]+)$/,
    handler: (_params, pathParams) => {
      const order = testOrders.find(o => o.uuid === pathParams?.uuid)
      if (!order) {
        // eslint-disable-next-line no-throw-literal
        throw { status: 404, message: 'Order not found' }
      }
      return { data: order }
    },
  },
  {
    pattern: /^\/user\/orders$/,
    handler: () => ({ data: testOrders }),
  },
]

function matchRoute(endpoint: string): RouteMatch | null {
  const [path] = endpoint.split('?')

  for (const route of routes) {
    const match = path.match(route.pattern)
    if (match) {
      const pathParams: Record<string, string> = {}

      // Extract path parameters
      if (path.startsWith('/products/') && match[1]) {
        pathParams.slug = match[1]
      }
      else if (path.startsWith('/categories/') && match[1]) {
        pathParams.slug = match[1]
      }
      else if (path.startsWith('/orders/') && match[1]) {
        pathParams.uuid = match[1]
      }

      return { handler: route.handler, params: pathParams }
    }
  }
  return null
}

export async function handleMockRequest<T>(
  endpoint: string,
  method: string,
  body?: unknown,
): Promise<T> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

  const routeMatch = matchRoute(endpoint)
  const [path, queryString] = endpoint.split('?')

  // Handle POST requests
  if (method === 'POST') {
    if (path === '/promo/validate') {
      const { code, order_total } = body as { code: string, order_total: number }
      const promo = testPromotions.find(
        p => p.code?.toLowerCase() === code.toLowerCase(),
      )

      if (!promo) {
        return {
          valid: false,
          message: 'Промокод не найден',
        } as T
      }

      if (promo.min_order_amount && order_total < promo.min_order_amount) {
        return {
          valid: false,
          message: `Минимальная сумма заказа: ${promo.min_order_amount}₽`,
        } as T
      }

      let discount_amount = 0
      if (promo.discount_type === 'percentage') {
        discount_amount = Math.round(order_total * (promo.discount_value / 100))
      }
      else if (promo.discount_type === 'fixed') {
        discount_amount = promo.discount_value
      }

      return {
        valid: true,
        promotion: promo,
        discount_amount,
      } as T
    }

    if (path === '/orders') {
      // Create a mock order
      const orderData = body as Record<string, unknown>
      const newOrder = {
        id: testOrders.length + 1,
        uuid: crypto.randomUUID(),
        status: 'new' as const,
        payment_status: 'pending' as const,
        customer_name: orderData.customer_name as string,
        customer_email: (orderData.customer_email as string) || null,
        customer_phone: (orderData.customer_phone as string) || null,
        recipient_name: (orderData.recipient_name as string) || null,
        recipient_phone: (orderData.recipient_phone as string) || null,
        shipping_address: orderData.shipping_address || null,
        delivery_type: orderData.delivery_type as 'delivery' | 'pickup',
        delivery_date: (orderData.delivery_date as string) || null,
        delivery_time_slot: null,
        pickup_point_id: (orderData.pickup_point_id as number) || null,
        notes: (orderData.notes as string) || null,
        subtotal: 0,
        discount: 0,
        total: 0,
        items: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // eslint-disable-next-line no-console
      console.log('[Mock API] Created order:', newOrder)
      return { data: newOrder } as T
    }
  }

  if (!routeMatch) {
    console.warn(`[Mock API] No handler for: ${method} ${endpoint}`)
    // eslint-disable-next-line no-throw-literal
    throw { status: 404, message: 'Endpoint not found' }
  }

  try {
    const result = routeMatch.handler(new URLSearchParams(queryString || ''), routeMatch.params)
    // eslint-disable-next-line no-console
    console.log(`[Mock API] ${method} ${endpoint}`, result)
    return result as T
  }
  catch (error) {
    console.error(`[Mock API] Error for ${method} ${endpoint}:`, error)
    throw error
  }
}

export const USE_MOCK_DATA = true
