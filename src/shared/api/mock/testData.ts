import type { PaginatedResponse } from '../types'

// Temporary types until entities layer is created
// These will be imported from @entities later

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  products_count?: number
}

interface ProductImage {
  id: number
  url: string
  is_thumbnail: boolean
}

interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  best_price: number
  has_discount: boolean
  stock_quantity: number
  is_active: boolean
  sku: string | null
  thumbnail: string | null
  images: ProductImage[]
  category: Category | null
  metadata: Record<string, unknown> | null
  related_products?: RelatedProduct[]
  created_at: string
  updated_at: string
}

interface RelatedProduct {
  id: number
  name: string
  slug: string
  price: number
  best_price: number
  thumbnail: string | null
}

interface DeliveryDate {
  date: string
  day_name: string
  is_available: boolean
  slots_count: number
  is_override?: boolean
  reason?: string | null
}

interface DeliverySlot {
  id: number
  type: 'regular' | 'override'
  name: string
  start_time: string
  end_time: string
  label: string
}

interface PickupPoint {
  id: number
  name: string
  address: string
  phone: string | null
  working_hours: string | null
  is_active: boolean
}

interface Promotion {
  id: number
  name: string
  slug: string
  description: string | null
  code: string | null
  discount_type: 'percentage' | 'fixed' | 'final_price'
  discount_value: number
  min_order_amount: number | null
  starts_at: string | null
  ends_at: string | null
}

interface ShippingAddress {
  street: string
  city: string
  zip: string
}

interface OrderItem {
  id: number
  product_id: number | null
  product_name: string
  product_sku: string | null
  price: number
  quantity: number
  total: number
}

interface Order {
  id: number
  uuid: string
  status: 'new' | 'confirmed' | 'processing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  recipient_name: string | null
  recipient_phone: string | null
  shipping_address: ShippingAddress | null
  delivery_type: 'delivery' | 'pickup'
  delivery_date: string | null
  delivery_time_slot: string | null
  pickup_point_id: number | null
  notes: string | null
  subtotal: number
  discount: number
  total: number
  items: OrderItem[]
  created_at: string
  updated_at: string
}

// ==================== Categories ====================

export const testCategories: Category[] = [
  {
    id: 1,
    name: 'Розы',
    slug: 'roses',
    description: 'Классические и необычные сорта роз',
    image_url: '/images/categories/roses.jpg',
    products_count: 24,
  },
  {
    id: 2,
    name: 'Тюльпаны',
    slug: 'tulips',
    description: 'Яркие весенние тюльпаны',
    image_url: '/images/categories/tulips.jpg',
    products_count: 18,
  },
  {
    id: 3,
    name: 'Пионы',
    slug: 'peonies',
    description: 'Роскошные пионы с неповторимым ароматом',
    image_url: '/images/categories/peonies.jpg',
    products_count: 12,
  },
  {
    id: 4,
    name: 'Букеты',
    slug: 'bouquets',
    description: 'Авторские букеты на любой случай',
    image_url: '/images/categories/bouquets.jpg',
    products_count: 36,
  },
  {
    id: 5,
    name: 'Композиции',
    slug: 'arrangements',
    description: 'Цветочные композиции в корзинах и коробках',
    image_url: '/images/categories/arrangements.jpg',
    products_count: 15,
  },
  {
    id: 6,
    name: 'Комнатные растения',
    slug: 'indoor-plants',
    description: 'Живые растения для дома и офиса',
    image_url: '/images/categories/plants.jpg',
    products_count: 20,
  },
]

// ==================== Products ====================

export const testProducts: Product[] = [
  {
    id: 1,
    name: 'Букет "Нежность"',
    slug: 'bouquet-tenderness',
    description: 'Нежный букет из розовых роз и белых эустом. Идеально подходит для романтического подарка или поздравления.',
    price: 4500,
    original_price: 5200,
    best_price: 4500,
    has_discount: true,
    stock_quantity: 15,
    is_active: true,
    sku: 'BQT-001',
    thumbnail: '/images/placeholders/buket-nejnost.jpeg',
    images: [
      { id: 1, url: '/images/placeholders/buket-nejnost.jpeg', is_thumbnail: true },
      { id: 2, url: '/images/placeholders/buket-nejnost.jpeg', is_thumbnail: false },
      { id: 3, url: '/images/placeholders/buket-nejnost.jpeg', is_thumbnail: false },
    ],
    category: testCategories[3],
    metadata: { flowers_count: 25, height: '45cm' },
    related_products: [
      {
        id: 2,
        name: 'Красные розы 25 шт',
        slug: 'red-roses-25',
        price: 6200,
        best_price: 6200,
        thumbnail: '/images/placeholders/rozi-25-shtuk.jpg',
      },
      {
        id: 7,
        name: 'Букет "Солнечный день"',
        slug: 'sunny-day',
        price: 5100,
        best_price: 5100,
        thumbnail: '/images/placeholders/buket-solnechniy-den.webp',
      },
      {
        id: 3,
        name: 'Букет "Весеннее настроение"',
        slug: 'spring-mood',
        price: 3800,
        best_price: 3800,
        thumbnail: '/images/placeholders/vesennee-nastroenie.jpg',
      },
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
  },
  {
    id: 2,
    name: 'Красные розы 25 шт',
    slug: 'red-roses-25',
    description: 'Классический букет из 25 красных роз премиум качества. Высота роз 60 см.',
    price: 6200,
    original_price: null,
    best_price: 6200,
    has_discount: false,
    stock_quantity: 20,
    is_active: true,
    sku: 'ROS-025',
    thumbnail: '/images/placeholders/rozi-25-shtuk.jpg',
    images: [
      { id: 4, url: '/images/placeholders/rozi-25-shtuk.jpg', is_thumbnail: true },
      { id: 5, url: '/images/placeholders/rozi-25-shtuk.jpg', is_thumbnail: false },
      { id: 6, url: '/images/placeholders/rozi-25-shtuk.jpg', is_thumbnail: false },
      { id: 7, url: '/images/placeholders/rozi-25-shtuk.jpg', is_thumbnail: false },
      { id: 8, url: '/images/placeholders/rozi-25-shtuk.jpg', is_thumbnail: false },
      { id: 9, url: '/images/placeholders/rozi-25-shtuk.jpg', is_thumbnail: false },
      { id: 10, url: '/images/placeholders/rozi-25-shtuk.jpg', is_thumbnail: false },
    ],
    category: testCategories[0],
    metadata: { flowers_count: 25, height: '60cm' },
    related_products: [
      {
        id: 8,
        name: 'Белые розы 51 шт',
        slug: 'white-roses-51',
        price: 11500,
        best_price: 11500,
        thumbnail: '/images/placeholders/belie-rozi-51-shtuka.jpg',
      },
      {
        id: 1,
        name: 'Букет "Нежность"',
        slug: 'bouquet-tenderness',
        price: 4500,
        best_price: 3500,
        thumbnail: '/images/placeholders/buket-nejnost.jpeg',
      },
      {
        id: 7,
        name: 'Букет "Солнечный день"',
        slug: 'sunny-day',
        price: 5100,
        best_price: 5100,
        thumbnail: '/images/placeholders/buket-solnechniy-den.webp',
      },
    ],
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    id: 3,
    name: 'Букет "Весеннее настроение"',
    slug: 'spring-mood',
    description: 'Яркий букет из разноцветных тюльпанов. Подарите весну круглый год!',
    price: 3800,
    original_price: 4200,
    best_price: 3800,
    has_discount: true,
    stock_quantity: 12,
    is_active: true,
    sku: 'TLP-015',
    thumbnail: '/images/placeholders/vesennee-nastroenie.jpg',
    images: [
      { id: 6, url: '/images/placeholders/vesennee-nastroenie.jpg', is_thumbnail: true },
    ],
    category: testCategories[1],
    metadata: { flowers_count: 15, height: '40cm' },
    related_products: [
      {
        id: 1,
        name: 'Букет "Нежность"',
        slug: 'bouquet-tenderness',
        price: 4500,
        best_price: 4500,
        thumbnail: '/images/placeholders/buket-nejnost.jpeg',
      },
      {
        id: 7,
        name: 'Букет "Солнечный день"',
        slug: 'sunny-day',
        price: 5100,
        best_price: 5100,
        thumbnail: '/images/placeholders/buket-solnechniy-den.webp',
      },
      {
        id: 2,
        name: 'Красные розы 25 шт',
        slug: 'red-roses-25',
        price: 6200,
        best_price: 6200,
        thumbnail: '/images/placeholders/rozi-25-shtuk.jpg',
      },
    ],
    created_at: '2024-01-12T11:00:00Z',
    updated_at: '2024-01-18T14:00:00Z',
  },
  {
    id: 4,
    name: 'Пионы "Сара Бернар"',
    slug: 'peonies-sarah-bernhardt',
    description: 'Великолепные розовые пионы сорта "Сара Бернар" с насыщенным ароматом.',
    price: 8500,
    original_price: null,
    best_price: 8500,
    has_discount: false,
    stock_quantity: 8,
    is_active: true,
    sku: 'PNY-007',
    thumbnail: '/images/placeholders/pioni-sara-bernar.jpg',
    images: [
      { id: 7, url: '/images/placeholders/pioni-sara-bernar.jpg', is_thumbnail: true },
      { id: 8, url: '/images/placeholders/pioni-sara-bernar.jpg', is_thumbnail: false },
    ],
    category: testCategories[2],
    metadata: { flowers_count: 7, height: '50cm' },
    related_products: [
      {
        id: 1,
        name: 'Букет "Нежность"',
        slug: 'bouquet-tenderness',
        price: 4500,
        best_price: 4500,
        thumbnail: '/images/placeholders/buket-nejnost.jpeg',
      },
      {
        id: 5,
        name: 'Композиция в шляпной коробке',
        slug: 'hat-box-arrangement',
        price: 7200,
        best_price: 7200,
        thumbnail: '/images/placeholders/kompoziciya-v-shliapnoy-korobke.jpg',
      },
      {
        id: 2,
        name: 'Красные розы 25 шт',
        slug: 'red-roses-25',
        price: 6200,
        best_price: 6200,
        thumbnail: '/images/placeholders/rozi-25-shtuk.jpg',
      },
    ],
    created_at: '2024-01-08T08:00:00Z',
    updated_at: '2024-01-08T08:00:00Z',
  },
  {
    id: 5,
    name: 'Композиция в шляпной коробке',
    slug: 'hat-box-arrangement',
    description: 'Элегантная цветочная композиция в фирменной шляпной коробке. Микс из роз, эустом и зелени.',
    price: 7200,
    original_price: 8000,
    best_price: 7200,
    has_discount: true,
    stock_quantity: 6,
    is_active: true,
    sku: 'ARR-003',
    thumbnail: '/images/placeholders/kompoziciya-v-shliapnoy-korobke.jpg',
    images: [
      { id: 9, url: '/images/placeholders/kompoziciya-v-shliapnoy-korobke.jpg', is_thumbnail: true },
      { id: 10, url: '/images/placeholders/kompoziciya-v-shliapnoy-korobke.jpg', is_thumbnail: false },
      { id: 11, url: '/images/placeholders/kompoziciya-v-shliapnoy-korobke.jpg', is_thumbnail: false },
    ],
    category: testCategories[4],
    metadata: { flowers_count: 30, box_size: 'L' },
    related_products: [
      {
        id: 9,
        name: 'Корзина с цветами "Праздник"',
        slug: 'celebration-basket',
        price: 9800,
        best_price: 9800,
        thumbnail: '/images/placeholders/korzina-s-cvetami-prazdnik.jpg',
      },
      {
        id: 4,
        name: 'Пионы "Сара Бернар"',
        slug: 'peonies-sarah-bernhardt',
        price: 8500,
        best_price: 8500,
        thumbnail: '/images/placeholders/pioni-sara-bernar.jpg',
      },
      {
        id: 1,
        name: 'Букет "Нежность"',
        slug: 'bouquet-tenderness',
        price: 4500,
        best_price: 4500,
        thumbnail: '/images/placeholders/buket-nejnost.jpeg',
      },
    ],
    created_at: '2024-01-14T12:00:00Z',
    updated_at: '2024-01-19T16:00:00Z',
  },
  {
    id: 6,
    name: 'Орхидея Фаленопсис',
    slug: 'orchid-phalaenopsis',
    description: 'Белая орхидея Фаленопсис в керамическом кашпо. Неприхотливое и долгоцветущее растение.',
    price: 4200,
    original_price: null,
    best_price: 4200,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'PLT-001',
    thumbnail: '/images/placeholders/arhideya-falinopsis.jpg',
    images: [
      { id: 12, url: '/images/placeholders/arhideya-falinopsis.jpg', is_thumbnail: true },
    ],
    category: testCategories[5],
    metadata: { height: '55cm', pot_material: 'ceramic' },
    related_products: [
      {
        id: 10,
        name: 'Монстера Делициоза',
        slug: 'monstera-deliciosa',
        price: 5500,
        best_price: 5500,
        thumbnail: '/images/placeholders/bouqet.png',
      },
      {
        id: 1,
        name: 'Букет "Нежность"',
        slug: 'bouquet-tenderness',
        price: 4500,
        best_price: 4500,
        thumbnail: '/images/placeholders/buket-nejnost.jpeg',
      },
      {
        id: 4,
        name: 'Пионы "Сара Бернар"',
        slug: 'peonies-sarah-bernhardt',
        price: 8500,
        best_price: 8500,
        thumbnail: '/images/placeholders/pioni-sara-bernar.jpg',
      },
    ],
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z',
  },
  {
    id: 7,
    name: 'Букет "Солнечный день"',
    slug: 'sunny-day',
    description: 'Жизнерадостный букет из желтых роз и подсолнухов. Отличный подарок для поднятия настроения!',
    price: 5100,
    original_price: null,
    best_price: 5100,
    has_discount: false,
    stock_quantity: 14,
    is_active: true,
    sku: 'BQT-007',
    thumbnail: '/images/placeholders/buket-solnechniy-den.webp',
    images: [
      { id: 13, url: '/images/placeholders/buket-solnechniy-den.webp', is_thumbnail: true },
      { id: 14, url: '/images/placeholders/buket-solnechniy-den.webp', is_thumbnail: false },
    ],
    category: testCategories[3],
    metadata: { flowers_count: 19, height: '50cm' },
    related_products: [
      {
        id: 1,
        name: 'Букет "Нежность"',
        slug: 'bouquet-tenderness',
        price: 4500,
        best_price: 4500,
        thumbnail: '/images/placeholders/buket-nejnost.jpeg',
      },
      {
        id: 3,
        name: 'Букет "Весеннее настроение"',
        slug: 'spring-mood',
        price: 3800,
        best_price: 3800,
        thumbnail: '/images/placeholders/vesennee-nastroenie.jpg',
      },
      {
        id: 2,
        name: 'Красные розы 25 шт',
        slug: 'red-roses-25',
        price: 6200,
        best_price: 6200,
        thumbnail: '/images/placeholders/rozi-25-shtuk.jpg',
      },
    ],
    created_at: '2024-01-13T09:30:00Z',
    updated_at: '2024-01-13T09:30:00Z',
  },
  {
    id: 8,
    name: 'Белые розы 51 шт',
    slug: 'white-roses-51',
    description: 'Роскошный букет из 51 белой розы. Идеально для важных событий и признаний.',
    price: 11500,
    original_price: 13000,
    best_price: 11500,
    has_discount: true,
    stock_quantity: 5,
    is_active: true,
    sku: 'ROS-051',
    thumbnail: '/images/placeholders/belie-rozi-51-shtuka.jpg',
    images: [
      { id: 15, url: '/images/placeholders/belie-rozi-51-shtuka.jpg', is_thumbnail: true },
      { id: 16, url: '/images/placeholders/belie-rozi-51-shtuka.jpg', is_thumbnail: false },
    ],
    category: testCategories[0],
    metadata: { flowers_count: 51, height: '70cm' },
    related_products: [
      {
        id: 2,
        name: 'Красные розы 25 шт',
        slug: 'red-roses-25',
        price: 6200,
        best_price: 6200,
        thumbnail: '/images/placeholders/rozi-25-shtuk.jpg',
      },
      {
        id: 1,
        name: 'Букет "Нежность"',
        slug: 'bouquet-tenderness',
        price: 4500,
        best_price: 4500,
        thumbnail: '/images/placeholders/buket-nejnost.jpeg',
      },
      {
        id: 7,
        name: 'Букет "Солнечный день"',
        slug: 'sunny-day',
        price: 5100,
        best_price: 5100,
        thumbnail: '/images/placeholders/buket-solnechniy-den.webp',
      },
    ],
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-21T10:00:00Z',
  },
  {
    id: 9,
    name: 'Корзина с цветами "Праздник"',
    slug: 'celebration-basket',
    description: 'Большая корзина с миксом сезонных цветов. Идеальный выбор для юбилея или корпоративного подарка.',
    price: 9800,
    original_price: null,
    best_price: 9800,
    has_discount: false,
    stock_quantity: 4,
    is_active: true,
    sku: 'ARR-009',
    thumbnail: '/images/placeholders/korzina-s-cvetami-prazdnik.jpg',
    images: [
      { id: 17, url: '/images/placeholders/korzina-s-cvetami-prazdnik.jpg', is_thumbnail: true },
    ],
    category: testCategories[4],
    metadata: { flowers_count: 50, basket_size: 'XL' },
    related_products: [
      {
        id: 5,
        name: 'Композиция в шляпной коробке',
        slug: 'hat-box-arrangement',
        price: 7200,
        best_price: 7200,
        thumbnail: '/images/placeholders/kompoziciya-v-shliapnoy-korobke.jpg',
      },
      {
        id: 4,
        name: 'Пионы "Сара Бернар"',
        slug: 'peonies-sarah-bernhardt',
        price: 8500,
        best_price: 8500,
        thumbnail: '/images/placeholders/pioni-sara-bernar.jpg',
      },
      {
        id: 8,
        name: 'Белые розы 51 шт',
        slug: 'white-roses-51',
        price: 11500,
        best_price: 11500,
        thumbnail: '/images/placeholders/belie-rozi-51-shtuka.jpg',
      },
    ],
    created_at: '2024-01-09T14:00:00Z',
    updated_at: '2024-01-09T14:00:00Z',
  },
  {
    id: 10,
    name: 'Монстера Делициоза',
    slug: 'monstera-deliciosa',
    description: 'Популярное тропическое растение с эффектными резными листьями. Высота 70 см.',
    price: 5500,
    original_price: 6000,
    best_price: 5500,
    has_discount: true,
    stock_quantity: 7,
    is_active: true,
    sku: 'PLT-005',
    thumbnail: '/images/placeholders/bouqet.png',
    images: [
      { id: 18, url: '/images/placeholders/bouqet.png', is_thumbnail: true },
      { id: 19, url: '/images/placeholders/bouqet.png', is_thumbnail: false },
    ],
    category: testCategories[5],
    metadata: { height: '70cm', pot_diameter: '21cm' },
    related_products: [
      {
        id: 6,
        name: 'Орхидея Фаленопсис',
        slug: 'orchid-phalaenopsis',
        price: 4200,
        best_price: 4200,
        thumbnail: '/images/placeholders/arhideya-falinopsis.jpg',
      },
      {
        id: 1,
        name: 'Букет "Нежность"',
        slug: 'bouquet-tenderness',
        price: 4500,
        best_price: 4500,
        thumbnail: '/images/placeholders/buket-nejnost.jpeg',
      },
      {
        id: 4,
        name: 'Пионы "Сара Бернар"',
        slug: 'peonies-sarah-bernhardt',
        price: 8500,
        best_price: 8500,
        thumbnail: '/images/placeholders/pioni-sara-bernar.jpg',
      },
    ],
    created_at: '2024-01-17T08:30:00Z',
    updated_at: '2024-01-22T09:00:00Z',
  },
]

// ==================== Delivery Dates ====================

const today = new Date()
const formatDate = (date: Date) => date.toISOString().split('T')[0]

export const testDeliveryDates: DeliveryDate[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(today)
  date.setDate(today.getDate() + i)
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  return {
    date: formatDate(date),
    day_name: dayNames[date.getDay()],
    is_available: i !== 0 && !isWeekend,
    slots_count: isWeekend ? 0 : (i === 0 ? 0 : 4),
    is_override: false,
    reason: i === 0 ? 'Сегодня доставка недоступна' : (isWeekend ? 'Выходной день' : null),
  }
})

// ==================== Delivery Slots ====================

export const testDeliverySlots: DeliverySlot[] = [
  {
    id: 1,
    type: 'regular',
    name: 'Утренняя доставка',
    start_time: '09:00',
    end_time: '12:00',
    label: '09:00 - 12:00',
  },
  {
    id: 2,
    type: 'regular',
    name: 'Дневная доставка',
    start_time: '12:00',
    end_time: '15:00',
    label: '12:00 - 15:00',
  },
  {
    id: 3,
    type: 'regular',
    name: 'Вечерняя доставка',
    start_time: '15:00',
    end_time: '18:00',
    label: '15:00 - 18:00',
  },
  {
    id: 4,
    type: 'regular',
    name: 'Поздняя доставка',
    start_time: '18:00',
    end_time: '21:00',
    label: '18:00 - 21:00',
  },
]

// ==================== Pickup Points ====================

export const testPickupPoints: PickupPoint[] = [
  {
    id: 1,
    name: 'Флористика на Невском',
    address: 'Невский проспект, 100',
    phone: '+7 (812) 123-45-67',
    working_hours: 'Пн-Вс: 09:00 - 21:00',
    is_active: true,
  },
  {
    id: 2,
    name: 'Цветочный бутик "Весна"',
    address: 'ул. Большая Морская, 25',
    phone: '+7 (812) 234-56-78',
    working_hours: 'Пн-Пт: 10:00 - 20:00, Сб-Вс: 11:00 - 19:00',
    is_active: true,
  },
  {
    id: 3,
    name: 'Vinteno Flowers ТЦ Галерея',
    address: 'Лиговский пр., 30А, ТЦ Галерея, 2 этаж',
    phone: '+7 (812) 345-67-89',
    working_hours: 'Пн-Вс: 10:00 - 22:00',
    is_active: true,
  },
]

// ==================== Promotions ====================

export const testPromotions: Promotion[] = [
  {
    id: 1,
    name: 'Скидка 15% на первый заказ',
    slug: 'first-order-15',
    description: 'Получите скидку 15% на ваш первый заказ! Используйте промокод при оформлении.',
    code: 'WELCOME15',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_amount: 3000,
    starts_at: '2024-01-01T00:00:00Z',
    ends_at: '2024-12-31T23:59:59Z',
  },
  {
    id: 2,
    name: 'Скидка 500₽ при заказе от 5000₽',
    slug: 'order-5000-discount',
    description: 'Закажите цветы на сумму от 5000₽ и получите скидку 500₽!',
    code: 'SAVE500',
    discount_type: 'fixed',
    discount_value: 500,
    min_order_amount: 5000,
    starts_at: '2024-01-01T00:00:00Z',
    ends_at: '2024-06-30T23:59:59Z',
  },
  {
    id: 3,
    name: 'Весенняя распродажа',
    slug: 'spring-sale',
    description: 'Весенняя распродажа на все тюльпаны! Скидка 20% автоматически.',
    code: null,
    discount_type: 'percentage',
    discount_value: 20,
    min_order_amount: null,
    starts_at: '2024-03-01T00:00:00Z',
    ends_at: '2024-03-31T23:59:59Z',
  },
]

export const testFeaturedPromotion: Promotion = testPromotions[0]

// ==================== Orders ====================

export const testOrders: Order[] = [
  {
    id: 1,
    uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    status: 'completed',
    payment_status: 'paid',
    customer_name: 'Иван Петров',
    customer_email: 'ivan.petrov@example.com',
    customer_phone: '+7 (999) 123-45-67',
    recipient_name: 'Мария Иванова',
    recipient_phone: '+7 (999) 765-43-21',
    shipping_address: {
      street: 'ул. Пушкина, д. 10, кв. 25',
      city: 'Санкт-Петербург',
      zip: '190000',
    },
    delivery_type: 'delivery',
    delivery_date: '2024-01-20',
    delivery_time_slot: '12:00 - 15:00',
    pickup_point_id: null,
    notes: 'Позвонить за 30 минут до доставки',
    subtotal: 6200,
    discount: 620,
    total: 5580,
    items: [
      {
        id: 1,
        product_id: 2,
        product_name: 'Красные розы 25 шт',
        product_sku: 'ROS-025',
        price: 6200,
        quantity: 1,
        total: 6200,
      },
    ],
    created_at: '2024-01-19T14:30:00Z',
    updated_at: '2024-01-20T16:00:00Z',
  },
  {
    id: 2,
    uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    status: 'processing',
    payment_status: 'paid',
    customer_name: 'Анна Сидорова',
    customer_email: 'anna.s@example.com',
    customer_phone: '+7 (999) 888-77-66',
    recipient_name: null,
    recipient_phone: null,
    shipping_address: null,
    delivery_type: 'pickup',
    delivery_date: '2024-01-22',
    delivery_time_slot: null,
    pickup_point_id: 1,
    notes: null,
    subtotal: 12300,
    discount: 0,
    total: 12300,
    items: [
      {
        id: 2,
        product_id: 4,
        product_name: 'Пионы "Сара Бернар"',
        product_sku: 'PNY-007',
        price: 8500,
        quantity: 1,
        total: 8500,
      },
      {
        id: 3,
        product_id: 3,
        product_name: 'Букет "Весеннее настроение"',
        product_sku: 'TLP-015',
        price: 3800,
        quantity: 1,
        total: 3800,
      },
    ],
    created_at: '2024-01-21T10:15:00Z',
    updated_at: '2024-01-21T10:15:00Z',
  },
  {
    id: 3,
    uuid: '12345678-90ab-cdef-1234-567890abcdef',
    status: 'new',
    payment_status: 'pending',
    customer_name: 'Дмитрий Козлов',
    customer_email: null,
    customer_phone: '+7 (999) 555-44-33',
    recipient_name: 'Елена Козлова',
    recipient_phone: '+7 (999) 111-22-33',
    shipping_address: {
      street: 'Московский пр., д. 150, кв. 88',
      city: 'Санкт-Петербург',
      zip: '196000',
    },
    delivery_type: 'delivery',
    delivery_date: '2024-01-25',
    delivery_time_slot: '18:00 - 21:00',
    pickup_point_id: null,
    notes: 'Не звонить - сюрприз!',
    subtotal: 11500,
    discount: 1150,
    total: 10350,
    items: [
      {
        id: 4,
        product_id: 8,
        product_name: 'Белые розы 51 шт',
        product_sku: 'ROS-051',
        price: 11500,
        quantity: 1,
        total: 11500,
      },
    ],
    created_at: '2024-01-22T18:45:00Z',
    updated_at: '2024-01-22T18:45:00Z',
  },
]

// ==================== Helper functions ====================

export function getTestProductBySlug(slug: string): Product | undefined {
  return testProducts.find(p => p.slug === slug)
}

export function getTestCategoryBySlug(slug: string): Category | undefined {
  return testCategories.find(c => c.slug === slug)
}

export function filterTestProducts(filters?: {
  category?: string
  search?: string
  min_price?: number
  max_price?: number
  sort?: string
  per_page?: number
  page?: number
}): PaginatedResponse<Product> {
  let filtered = [...testProducts]

  if (filters?.category) {
    filtered = filtered.filter(p => p.category?.slug === filters.category)
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(searchLower)
        || p.description?.toLowerCase().includes(searchLower),
    )
  }

  if (filters?.min_price) {
    filtered = filtered.filter(p => p.best_price >= filters.min_price!)
  }

  if (filters?.max_price) {
    filtered = filtered.filter(p => p.best_price <= filters.max_price!)
  }

  if (filters?.sort) {
    switch (filters.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.best_price - b.best_price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.best_price - a.best_price)
        break
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        break
    }
  }

  const perPage = filters?.per_page || 10
  const page = filters?.page || 1
  const start = (page - 1) * perPage
  const paginatedData = filtered.slice(start, start + perPage)

  return {
    data: paginatedData,
    links: {
      first: '/api/v1/products?page=1',
      last: `/api/v1/products?page=${Math.ceil(filtered.length / perPage)}`,
      prev: page > 1 ? `/api/v1/products?page=${page - 1}` : null,
      next:
                page < Math.ceil(filtered.length / perPage)
                  ? `/api/v1/products?page=${page + 1}`
                  : null,
    },
    meta: {
      current_page: page,
      from: filtered.length > 0 ? start + 1 : null,
      last_page: Math.ceil(filtered.length / perPage),
      path: '/api/v1/products',
      per_page: perPage,
      to: filtered.length > 0 ? Math.min(start + perPage, filtered.length) : null,
      total: filtered.length,
    },
  }
}
