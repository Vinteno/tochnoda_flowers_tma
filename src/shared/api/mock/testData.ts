import type { ImageSet, ImageWithPreview } from '@shared/lib'
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

interface ProductImage extends ImageWithPreview {
  id: number
  is_thumbnail: boolean
}

interface LegacyProductImage {
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
  thumbnail: ImageSet | null
  images: ProductImage[]
  category: Category | null
  metadata: Record<string, unknown> | null
  related_products?: RelatedProduct[]
  created_at: string
  updated_at: string
}

interface LegacyProduct extends Omit<Product, 'images' | 'thumbnail' | 'related_products'> {
  thumbnail: string | null
  images: LegacyProductImage[]
  related_products?: LegacyRelatedProduct[]
}

interface RelatedProduct {
  id: number
  name: string
  slug: string
  price: number
  best_price: number
  thumbnail: ImageSet | null
}

interface LegacyRelatedProduct {
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
  banner?: {
    original: string
    small: string
    webp?: {
      original: string
      small: string
    }
  } | null
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
    name: 'Букеты',
    slug: 'bouquets',
    description: 'Авторские букеты на любой случай',
    image_url: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aca4a3ca885de77f86b5c498008/XXL',
    products_count: 22,
  },
  {
    id: 2,
    name: 'Композиции',
    slug: 'arrangements',
    description: 'Цветочные композиции в оригинальном оформлении',
    image_url: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab6e14abc1487272d6cdf098c3/XXL',
    products_count: 2,
  },
  {
    id: 3,
    name: 'Подарки',
    slug: 'gifts',
    description: 'Шары, игрушки и другие подарки',
    image_url: 'https://avatars.mds.yandex.net/get-sprav-products/2510998/2a000001951a2723b26ea214c35de8e60dd2/XXL',
    products_count: 3,
  },
]

// ==================== Products ====================

const mapLegacyImage = (image: LegacyProductImage): ProductImage => ({
  id: image.id,
  original: image.url,
  thumb: image.url,
  preview: image.url,
  is_thumbnail: image.is_thumbnail,
})

const mapLegacyThumbnail = (url: string | null): ImageSet | null => {
  if (!url) {
    return null
  }
  return { original: url, thumb: url }
}

const mapLegacyRelatedProduct = (product: LegacyRelatedProduct): RelatedProduct => ({
  ...product,
  thumbnail: mapLegacyThumbnail(product.thumbnail),
})

const normalizeLegacyProduct = (product: LegacyProduct): Product => ({
  ...product,
  thumbnail: mapLegacyThumbnail(product.thumbnail),
  images: product.images.map(mapLegacyImage),
  related_products: product.related_products?.map(mapLegacyRelatedProduct),
})

const legacyProducts: LegacyProduct[] = [
  {
    id: 1,
    name: 'Букет № 1589',
    slug: 'buket-1589',
    description: 'Букет, который будет очень долго радовать получателя.',
    price: 4650,
    original_price: null,
    best_price: 4650,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'BKT-001',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aca4a3ca885de77f86b5c498008/XXL',
    images: [
      { id: 1, url: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aca4a3ca885de77f86b5c498008/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 2, name: 'Букет "Розовый фейерверк"', slug: 'buket-rozovyy-feyerverk', price: 5250, best_price: 5250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2994796/2a0000019aaf7662221601985dde2bb7199e/XXL' },
      { id: 6, name: 'Букет "Зефир"', slug: 'buket-zefir', price: 3650, best_price: 3650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5a6c37a59fcd0239414f2ea8/XXL' },
      { id: 5, name: 'Букет «Танец лепестков»', slug: 'buket-tanets-lepestkov', price: 4850, best_price: 4850, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5f19b2ceba887a9c6dcef89b/XXL' },
    ],
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-20T15:30:00Z',
  },
  {
    id: 2,
    name: 'Букет "Розовый фейерверк"',
    slug: 'buket-rozovyy-feyerverk',
    description: 'Большой букет в розовой цветовой гамме с герберами, альстромериями и хризантемами.',
    price: 5250,
    original_price: null,
    best_price: 5250,
    has_discount: false,
    stock_quantity: 8,
    is_active: true,
    sku: 'BKT-002',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2994796/2a0000019aaf7662221601985dde2bb7199e/XXL',
    images: [
      { id: 2, url: 'https://avatars.mds.yandex.net/get-sprav-products/2994796/2a0000019aaf7662221601985dde2bb7199e/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 1, name: 'Букет № 1589', slug: 'buket-1589', price: 4650, best_price: 4650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aca4a3ca885de77f86b5c498008/XXL' },
      { id: 7, name: 'Букет «Весёлый аккорд»', slug: 'buket-vesyolyy-akkord', price: 4250, best_price: 4250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab540f179ba2c82b0ddb0d4027/XXL' },
      { id: 12, name: 'Сборный полевой букет', slug: 'sbornyy-polevoy-buket', price: 4950, best_price: 4950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab147d85b918a1171eafda10df/XXL' },
    ],
    created_at: '2026-01-14T09:00:00Z',
    updated_at: '2026-01-14T09:00:00Z',
  },
  {
    id: 3,
    name: 'Композиция "Гера"',
    slug: 'kompoziciya-gera',
    description: 'Композиция с герберами — это яркий, жизнерадостный акцент в любом интерьере и выразительный подарок для самых разных поводов. Благодаря крупным соцветиям, напоминающим миниатюрные солнышки, и богатой палитре оттенков, такая аранжировка мгновенно создаёт атмосферу праздника и поднимает настроение.',
    price: 2550,
    original_price: null,
    best_price: 2550,
    has_discount: false,
    stock_quantity: 6,
    is_active: true,
    sku: 'KMP-001',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab6e14abc1487272d6cdf098c3/XXL',
    images: [
      { id: 3, url: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab6e14abc1487272d6cdf098c3/XXL', is_thumbnail: true },
    ],
    category: testCategories[1],
    metadata: null,
    related_products: [
      { id: 23, name: 'Сумки с диантусами', slug: 'sumki-s-diantusami', price: 2950, best_price: 2950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1643978/2a000001932ad2188c49781abb5ae9fef050/XXL' },
      { id: 4, name: 'Букет «Тёплое воспоминание»', slug: 'buket-tyoploye-vospominanie', price: 3550, best_price: 3550, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2773996/2a0000019aab687a808690b605dded1521f2/XXL' },
      { id: 7, name: 'Букет «Весёлый аккорд»', slug: 'buket-vesyolyy-akkord', price: 4250, best_price: 4250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab540f179ba2c82b0ddb0d4027/XXL' },
    ],
    created_at: '2026-01-13T11:00:00Z',
    updated_at: '2026-01-18T14:00:00Z',
  },
  {
    id: 4,
    name: 'Букет «Тёплое воспоминание»',
    slug: 'buket-tyoploye-vospominanie',
    description: 'Букет из гербер — это концентрированное воплощение радости и солнечного света. Благодаря форме, напоминающей миниатюрные солнышки или ромашки, и насыщенной палитре оттенков, композиция мгновенно привлекает внимание и создаёт атмосферу праздника.',
    price: 3550,
    original_price: null,
    best_price: 3550,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'BKT-003',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2773996/2a0000019aab687a808690b605dded1521f2/XXL',
    images: [
      { id: 4, url: 'https://avatars.mds.yandex.net/get-sprav-products/2773996/2a0000019aab687a808690b605dded1521f2/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 7, name: 'Букет «Весёлый аккорд»', slug: 'buket-vesyolyy-akkord', price: 4250, best_price: 4250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab540f179ba2c82b0ddb0d4027/XXL' },
      { id: 3, name: 'Композиция "Гера"', slug: 'kompoziciya-gera', price: 2550, best_price: 2550, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab6e14abc1487272d6cdf098c3/XXL' },
      { id: 6, name: 'Букет "Зефир"', slug: 'buket-zefir', price: 3650, best_price: 3650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5a6c37a59fcd0239414f2ea8/XXL' },
    ],
    created_at: '2026-01-12T08:00:00Z',
    updated_at: '2026-01-12T08:00:00Z',
  },
  {
    id: 5,
    name: 'Букет «Танец лепестков»',
    slug: 'buket-tanets-lepestkov',
    description: 'Букет из кустовых роз — это гармоничное сочетание природной лёгкости и изысканной элегантности. В отличие от классических роз с одним бутоном на стебле, кустовые формируют пышные соцветия из множества небольших цветков, создавая эффект миниатюрного сада. Композиция выглядит объёмной, воздушной и по\u2011домашнему тёплой, но при этом сохраняет утончённый стиль.',
    price: 4850,
    original_price: null,
    best_price: 4850,
    has_discount: false,
    stock_quantity: 7,
    is_active: true,
    sku: 'BKT-004',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5f19b2ceba887a9c6dcef89b/XXL',
    images: [
      { id: 5, url: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5f19b2ceba887a9c6dcef89b/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 16, name: 'Моно из кустовых роз', slug: 'mono-iz-kustovyh-roz', price: 3450, best_price: 3450, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/3912342/2a0000019aca4694c2e345a7b11a9af47863/XXL' },
      { id: 1, name: 'Букет № 1589', slug: 'buket-1589', price: 4650, best_price: 4650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aca4a3ca885de77f86b5c498008/XXL' },
      { id: 14, name: 'Букет № 623', slug: 'buket-623', price: 8300, best_price: 8300, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019a976701ad0eeeaae77574d486aa/XXL' },
    ],
    created_at: '2026-01-11T12:00:00Z',
    updated_at: '2026-01-19T16:00:00Z',
  },
  {
    id: 6,
    name: 'Букет "Зефир"',
    slug: 'buket-zefir',
    description: 'Идеальный букет для мамы. В состав букета входит: гортензия, эустома, зелень, кустовая роза и диантусы, которые символизируют материнскую любовь.',
    price: 3650,
    original_price: null,
    best_price: 3650,
    has_discount: false,
    stock_quantity: 12,
    is_active: true,
    sku: 'BKT-005',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5a6c37a59fcd0239414f2ea8/XXL',
    images: [
      { id: 6, url: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5a6c37a59fcd0239414f2ea8/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 8, name: 'Букет «Первое свидание»', slug: 'buket-pervoe-svidanie', price: 3950, best_price: 3950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab293161b8acaced5d4ce75110/XXL' },
      { id: 26, name: 'Букет № 1484', slug: 'buket-1484', price: 3650, best_price: 3650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1424222/2a00000190c500f4953f2666913fe00760db/XXL' },
      { id: 4, name: 'Букет «Тёплое воспоминание»', slug: 'buket-tyoploye-vospominanie', price: 3550, best_price: 3550, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2773996/2a0000019aab687a808690b605dded1521f2/XXL' },
    ],
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 7,
    name: 'Букет «Весёлый аккорд»',
    slug: 'buket-vesyolyy-akkord',
    description: 'Яркий, жизнерадостный букет с герберами — воплощение солнечного настроения и искренней радости. Эти цветы с крупными соцветиями, напоминающими миниатюрные солнышки, создают ощущение тепла и праздника, делая композицию заметной и запоминающейся.',
    price: 4250,
    original_price: null,
    best_price: 4250,
    has_discount: false,
    stock_quantity: 9,
    is_active: true,
    sku: 'BKT-006',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab540f179ba2c82b0ddb0d4027/XXL',
    images: [
      { id: 7, url: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab540f179ba2c82b0ddb0d4027/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 4, name: 'Букет «Тёплое воспоминание»', slug: 'buket-tyoploye-vospominanie', price: 3550, best_price: 3550, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2773996/2a0000019aab687a808690b605dded1521f2/XXL' },
      { id: 2, name: 'Букет "Розовый фейерверк"', slug: 'buket-rozovyy-feyerverk', price: 5250, best_price: 5250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2994796/2a0000019aaf7662221601985dde2bb7199e/XXL' },
      { id: 9, name: 'Букет "Лагуна"', slug: 'buket-laguna', price: 4350, best_price: 4350, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2413620/2a0000019aab23f3fb953ae0aac0717cb184/XXL' },
    ],
    created_at: '2026-01-09T09:30:00Z',
    updated_at: '2026-01-09T09:30:00Z',
  },
  {
    id: 8,
    name: 'Букет «Первое свидание»',
    slug: 'buket-pervoe-svidanie',
    description: 'Букет с гортензией и орхидеей. Орхидея имеет приятный запах и славится хорошей стойкостью.',
    price: 3950,
    original_price: null,
    best_price: 3950,
    has_discount: false,
    stock_quantity: 8,
    is_active: true,
    sku: 'BKT-007',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab293161b8acaced5d4ce75110/XXL',
    images: [
      { id: 8, url: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab293161b8acaced5d4ce75110/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 6, name: 'Букет "Зефир"', slug: 'buket-zefir', price: 3650, best_price: 3650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5a6c37a59fcd0239414f2ea8/XXL' },
      { id: 9, name: 'Букет "Лагуна"', slug: 'buket-laguna', price: 4350, best_price: 4350, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2413620/2a0000019aab23f3fb953ae0aac0717cb184/XXL' },
      { id: 11, name: 'Букет «Мечта влюблённого»', slug: 'buket-mechta-vlyublyonnogo', price: 4650, best_price: 4650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/17712810/2a0000019aab1736c6b9d96246065333545d/XXL' },
    ],
    created_at: '2026-01-08T11:00:00Z',
    updated_at: '2026-01-16T10:00:00Z',
  },
  {
    id: 9,
    name: 'Букет "Лагуна"',
    slug: 'buket-laguna',
    description: 'Букет с синими гортензиями, белой альстромерией и зеленью.\n\nБольшой раскидистый букет. При правильном уходе гортензии сохраняют свежесть 7–14 дней.',
    price: 4350,
    original_price: null,
    best_price: 4350,
    has_discount: false,
    stock_quantity: 6,
    is_active: true,
    sku: 'BKT-008',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2413620/2a0000019aab23f3fb953ae0aac0717cb184/XXL',
    images: [
      { id: 9, url: 'https://avatars.mds.yandex.net/get-sprav-products/2413620/2a0000019aab23f3fb953ae0aac0717cb184/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 10, name: 'Букет «Облако»', slug: 'buket-oblako', price: 3850, best_price: 3850, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab1dec90b0cfd2cea457ccc551/XXL' },
      { id: 8, name: 'Букет «Первое свидание»', slug: 'buket-pervoe-svidanie', price: 3950, best_price: 3950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab293161b8acaced5d4ce75110/XXL' },
      { id: 7, name: 'Букет «Весёлый аккорд»', slug: 'buket-vesyolyy-akkord', price: 4250, best_price: 4250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab540f179ba2c82b0ddb0d4027/XXL' },
    ],
    created_at: '2026-01-07T14:00:00Z',
    updated_at: '2026-01-07T14:00:00Z',
  },
  {
    id: 10,
    name: 'Букет «Облако»',
    slug: 'buket-oblako',
    description: 'Букет из хризантемы "Алтай" и эустомы в белом цвете.\n\nБукет порадует хорошей стойкостью.',
    price: 3850,
    original_price: null,
    best_price: 3850,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'BKT-009',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab1dec90b0cfd2cea457ccc551/XXL',
    images: [
      { id: 10, url: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab1dec90b0cfd2cea457ccc551/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 9, name: 'Букет "Лагуна"', slug: 'buket-laguna', price: 4350, best_price: 4350, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2413620/2a0000019aab23f3fb953ae0aac0717cb184/XXL' },
      { id: 6, name: 'Букет "Зефир"', slug: 'buket-zefir', price: 3650, best_price: 3650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5a6c37a59fcd0239414f2ea8/XXL' },
      { id: 11, name: 'Букет «Мечта влюблённого»', slug: 'buket-mechta-vlyublyonnogo', price: 4650, best_price: 4650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/17712810/2a0000019aab1736c6b9d96246065333545d/XXL' },
    ],
    created_at: '2026-01-06T08:30:00Z',
    updated_at: '2026-01-22T09:00:00Z',
  },
  {
    id: 11,
    name: 'Букет «Мечта влюблённого»',
    slug: 'buket-mechta-vlyublyonnogo',
    description: 'Букет с премиальными розами "Candlelight".\n\nИмеют полное раскрытие и приятный аромат. В сочетании с альстромерией и зеленью вызывает WOW-эффект.',
    price: 4650,
    original_price: null,
    best_price: 4650,
    has_discount: false,
    stock_quantity: 5,
    is_active: true,
    sku: 'BKT-010',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/17712810/2a0000019aab1736c6b9d96246065333545d/XXL',
    images: [
      { id: 11, url: 'https://avatars.mds.yandex.net/get-sprav-products/17712810/2a0000019aab1736c6b9d96246065333545d/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 8, name: 'Букет «Первое свидание»', slug: 'buket-pervoe-svidanie', price: 3950, best_price: 3950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab293161b8acaced5d4ce75110/XXL' },
      { id: 13, name: 'Букет из белых роз', slug: 'buket-iz-belyh-roz', price: 6950, best_price: 6950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2808945/2a0000019aab107fd12f0b516bd5ec98fc0d/XXL' },
      { id: 27, name: 'Букет из 51 розы', slug: 'buket-iz-51-rozy', price: 18950, best_price: 18950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/5280674/2a0000019063c4f975777bb143bd3ac4c2d4/XXL' },
    ],
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-05T10:00:00Z',
  },
  {
    id: 12,
    name: 'Сборный полевой букет',
    slug: 'sbornyy-polevoy-buket',
    description: 'Большой сборный букет в круглой упаковке.\n\nПорадует хорошей стойкостью и приятным ароматом.',
    price: 4950,
    original_price: null,
    best_price: 4950,
    has_discount: false,
    stock_quantity: 8,
    is_active: true,
    sku: 'BKT-011',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab147d85b918a1171eafda10df/XXL',
    images: [
      { id: 12, url: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab147d85b918a1171eafda10df/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 15, name: 'Сборный букет 5454', slug: 'sbornyy-buket-5454', price: 4850, best_price: 4850, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a00000199c41f0570b6d14893e4690050e2/XXL' },
      { id: 2, name: 'Букет "Розовый фейерверк"', slug: 'buket-rozovyy-feyerverk', price: 5250, best_price: 5250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2994796/2a0000019aaf7662221601985dde2bb7199e/XXL' },
      { id: 7, name: 'Букет «Весёлый аккорд»', slug: 'buket-vesyolyy-akkord', price: 4250, best_price: 4250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab540f179ba2c82b0ddb0d4027/XXL' },
    ],
    created_at: '2026-01-04T14:00:00Z',
    updated_at: '2026-01-04T14:00:00Z',
  },
  {
    id: 13,
    name: 'Букет из белых роз',
    slug: 'buket-iz-belyh-roz',
    description: 'Букет из 21 белой розы — монобукет, который станет ярким и запоминающимся подарком для любого повода. Белые розы символизируют чистоту, невинность, любовь и нежность, что делает их универсальным выбором для дня рождения, свадьбы, юбилея или просто знака внимания.',
    price: 6950,
    original_price: null,
    best_price: 6950,
    has_discount: false,
    stock_quantity: 6,
    is_active: true,
    sku: 'BKT-012',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2808945/2a0000019aab107fd12f0b516bd5ec98fc0d/XXL',
    images: [
      { id: 13, url: 'https://avatars.mds.yandex.net/get-sprav-products/2808945/2a0000019aab107fd12f0b516bd5ec98fc0d/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 27, name: 'Букет из 51 розы', slug: 'buket-iz-51-rozy', price: 18950, best_price: 18950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/5280674/2a0000019063c4f975777bb143bd3ac4c2d4/XXL' },
      { id: 11, name: 'Букет «Мечта влюблённого»', slug: 'buket-mechta-vlyublyonnogo', price: 4650, best_price: 4650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/17712810/2a0000019aab1736c6b9d96246065333545d/XXL' },
      { id: 16, name: 'Моно из кустовых роз', slug: 'mono-iz-kustovyh-roz', price: 3450, best_price: 3450, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/3912342/2a0000019aca4694c2e345a7b11a9af47863/XXL' },
    ],
    created_at: '2026-01-03T09:00:00Z',
    updated_at: '2026-01-03T09:00:00Z',
  },
  {
    id: 14,
    name: 'Букет № 623',
    slug: 'buket-623',
    description: 'Букет собран из 15 веток сортовой кустовой розы премиум плантации с эвкалиптом',
    price: 8300,
    original_price: null,
    best_price: 8300,
    has_discount: false,
    stock_quantity: 4,
    is_active: true,
    sku: 'BKT-013',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019a976701ad0eeeaae77574d486aa/XXL',
    images: [
      { id: 14, url: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019a976701ad0eeeaae77574d486aa/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 5, name: 'Букет «Танец лепестков»', slug: 'buket-tanets-lepestkov', price: 4850, best_price: 4850, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5f19b2ceba887a9c6dcef89b/XXL' },
      { id: 13, name: 'Букет из белых роз', slug: 'buket-iz-belyh-roz', price: 6950, best_price: 6950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2808945/2a0000019aab107fd12f0b516bd5ec98fc0d/XXL' },
      { id: 27, name: 'Букет из 51 розы', slug: 'buket-iz-51-rozy', price: 18950, best_price: 18950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/5280674/2a0000019063c4f975777bb143bd3ac4c2d4/XXL' },
    ],
    created_at: '2026-01-02T11:00:00Z',
    updated_at: '2026-01-02T11:00:00Z',
  },
  {
    id: 15,
    name: 'Сборный букет 5454',
    slug: 'sbornyy-buket-5454',
    description: 'Состав букета:\nОдноголовые хризантемы\nКустовые хризантемы\nКустовая роза\nАльстромерия\nЗелень\nЛагурус\n\nБукет имеет стойкость от 10 дней (при правильном уходе)',
    price: 4850,
    original_price: null,
    best_price: 4850,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'BKT-014',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a00000199c41f0570b6d14893e4690050e2/XXL',
    images: [
      { id: 15, url: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a00000199c41f0570b6d14893e4690050e2/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 12, name: 'Сборный полевой букет', slug: 'sbornyy-polevoy-buket', price: 4950, best_price: 4950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab147d85b918a1171eafda10df/XXL' },
      { id: 7, name: 'Букет «Весёлый аккорд»', slug: 'buket-vesyolyy-akkord', price: 4250, best_price: 4250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab540f179ba2c82b0ddb0d4027/XXL' },
      { id: 1, name: 'Букет № 1589', slug: 'buket-1589', price: 4650, best_price: 4650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aca4a3ca885de77f86b5c498008/XXL' },
    ],
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 16,
    name: 'Моно из кустовых роз',
    slug: 'mono-iz-kustovyh-roz',
    description: 'Кустовые розы в стильной упаковке.',
    price: 3450,
    original_price: null,
    best_price: 3450,
    has_discount: false,
    stock_quantity: 12,
    is_active: true,
    sku: 'BKT-015',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/3912342/2a0000019aca4694c2e345a7b11a9af47863/XXL',
    images: [
      { id: 16, url: 'https://avatars.mds.yandex.net/get-sprav-products/3912342/2a0000019aca4694c2e345a7b11a9af47863/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 5, name: 'Букет «Танец лепестков»', slug: 'buket-tanets-lepestkov', price: 4850, best_price: 4850, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5f19b2ceba887a9c6dcef89b/XXL' },
      { id: 14, name: 'Букет № 623', slug: 'buket-623', price: 8300, best_price: 8300, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019a976701ad0eeeaae77574d486aa/XXL' },
      { id: 13, name: 'Букет из белых роз', slug: 'buket-iz-belyh-roz', price: 6950, best_price: 6950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2808945/2a0000019aab107fd12f0b516bd5ec98fc0d/XXL' },
    ],
    created_at: '2025-12-30T09:00:00Z',
    updated_at: '2025-12-30T09:00:00Z',
  },
  {
    id: 17,
    name: 'Букет № 997',
    slug: 'buket-997',
    description: 'Моно букет из альстромерий. Порадуют Вас хорошей стойкостью от 7 до 21 дня. Не имеют аромата.',
    price: 6550,
    original_price: null,
    best_price: 6550,
    has_discount: false,
    stock_quantity: 7,
    is_active: true,
    sku: 'BKT-016',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13852611/2a0000019924a9d157284b088263ef2354ed/XXL',
    images: [
      { id: 17, url: 'https://avatars.mds.yandex.net/get-sprav-products/13852611/2a0000019924a9d157284b088263ef2354ed/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 13, name: 'Букет из белых роз', slug: 'buket-iz-belyh-roz', price: 6950, best_price: 6950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2808945/2a0000019aab107fd12f0b516bd5ec98fc0d/XXL' },
      { id: 14, name: 'Букет № 623', slug: 'buket-623', price: 8300, best_price: 8300, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019a976701ad0eeeaae77574d486aa/XXL' },
      { id: 12, name: 'Сборный полевой букет', slug: 'sbornyy-polevoy-buket', price: 4950, best_price: 4950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab147d85b918a1171eafda10df/XXL' },
    ],
    created_at: '2025-12-28T08:00:00Z',
    updated_at: '2025-12-28T08:00:00Z',
  },
  {
    id: 18,
    name: 'Большой шар "Сердце"',
    slug: 'bolshoy-shar-serdtse',
    description: 'Фольгированный шар в форме большого сердца.\n\nДоступен только в красном цвете.\n\nДиаметр шара - 80 см.',
    price: 850,
    original_price: null,
    best_price: 850,
    has_discount: false,
    stock_quantity: 20,
    is_active: true,
    sku: 'GFT-001',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2510998/2a000001951a2723b26ea214c35de8e60dd2/XXL',
    images: [
      { id: 18, url: 'https://avatars.mds.yandex.net/get-sprav-products/2510998/2a000001951a2723b26ea214c35de8e60dd2/XXL', is_thumbnail: true },
    ],
    category: testCategories[2],
    metadata: null,
    related_products: [
      { id: 19, name: 'Шар "Сердце"', slug: 'shar-serdtse', price: 550, best_price: 550, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/4078836/2a000001951a25b6755fd445fdb7f6b7905e/XXL' },
      { id: 20, name: 'Игрушка Медведь', slug: 'igrushka-medved', price: 1450, best_price: 1450, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1521147/2a000001951a1f92bc005cdc5d563d5f403c/XXL' },
      { id: 8, name: 'Букет «Первое свидание»', slug: 'buket-pervoe-svidanie', price: 3950, best_price: 3950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab293161b8acaced5d4ce75110/XXL' },
    ],
    created_at: '2025-12-25T10:00:00Z',
    updated_at: '2025-12-25T10:00:00Z',
  },
  {
    id: 19,
    name: 'Шар "Сердце"',
    slug: 'shar-serdtse',
    description: 'Фольгированный шар в форме сердца, доступен в разных цветах, для более точной информации - звоните.\n\nДиаметр шара - 45 см.',
    price: 550,
    original_price: null,
    best_price: 550,
    has_discount: false,
    stock_quantity: 30,
    is_active: true,
    sku: 'GFT-002',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/4078836/2a000001951a25b6755fd445fdb7f6b7905e/XXL',
    images: [
      { id: 19, url: 'https://avatars.mds.yandex.net/get-sprav-products/4078836/2a000001951a25b6755fd445fdb7f6b7905e/XXL', is_thumbnail: true },
    ],
    category: testCategories[2],
    metadata: null,
    related_products: [
      { id: 18, name: 'Большой шар "Сердце"', slug: 'bolshoy-shar-serdtse', price: 850, best_price: 850, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2510998/2a000001951a2723b26ea214c35de8e60dd2/XXL' },
      { id: 20, name: 'Игрушка Медведь', slug: 'igrushka-medved', price: 1450, best_price: 1450, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1521147/2a000001951a1f92bc005cdc5d563d5f403c/XXL' },
      { id: 11, name: 'Букет «Мечта влюблённого»', slug: 'buket-mechta-vlyublyonnogo', price: 4650, best_price: 4650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/17712810/2a0000019aab1736c6b9d96246065333545d/XXL' },
    ],
    created_at: '2025-12-24T10:00:00Z',
    updated_at: '2025-12-24T10:00:00Z',
  },
  {
    id: 20,
    name: 'Игрушка Медведь',
    slug: 'igrushka-medved',
    description: 'Мягкие игрушки медведи.\n\n40 см - рост медведя.\n\nВ наличии есть: розовые, белые, коричневые и бежевые медведи.',
    price: 1450,
    original_price: null,
    best_price: 1450,
    has_discount: false,
    stock_quantity: 15,
    is_active: true,
    sku: 'GFT-003',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1521147/2a000001951a1f92bc005cdc5d563d5f403c/XXL',
    images: [
      { id: 20, url: 'https://avatars.mds.yandex.net/get-sprav-products/1521147/2a000001951a1f92bc005cdc5d563d5f403c/XXL', is_thumbnail: true },
    ],
    category: testCategories[2],
    metadata: null,
    related_products: [
      { id: 18, name: 'Большой шар "Сердце"', slug: 'bolshoy-shar-serdtse', price: 850, best_price: 850, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2510998/2a000001951a2723b26ea214c35de8e60dd2/XXL' },
      { id: 19, name: 'Шар "Сердце"', slug: 'shar-serdtse', price: 550, best_price: 550, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/4078836/2a000001951a25b6755fd445fdb7f6b7905e/XXL' },
      { id: 6, name: 'Букет "Зефир"', slug: 'buket-zefir', price: 3650, best_price: 3650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5a6c37a59fcd0239414f2ea8/XXL' },
    ],
    created_at: '2025-12-23T10:00:00Z',
    updated_at: '2025-12-23T10:00:00Z',
  },
  {
    id: 21,
    name: 'Букет из диантусов',
    slug: 'buket-iz-diantusov',
    description: 'Моно букет из диантусов в интересной упаковке.\n\nСтойкость от 10 дней, при правильном уходе.\n\nСобираем в разной цветовой гамме.',
    price: 2150,
    original_price: null,
    best_price: 2150,
    has_discount: false,
    stock_quantity: 14,
    is_active: true,
    sku: 'BKT-017',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a000001932afcdb140507c68a1ff0eb61bb/XXL',
    images: [
      { id: 21, url: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a000001932afcdb140507c68a1ff0eb61bb/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 22, name: 'Букет "Диантус"', slug: 'buket-diantus', price: 3250, best_price: 3250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2893106/2a000001932ad46e932ac702dcaebe517ddd/XXL' },
      { id: 23, name: 'Сумки с диантусами', slug: 'sumki-s-diantusami', price: 2950, best_price: 2950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1643978/2a000001932ad2188c49781abb5ae9fef050/XXL' },
      { id: 24, name: 'Букет "Моно XS"', slug: 'buket-mono-xs', price: 2250, best_price: 2250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1540730/2a0000019924850fa09381ab3ef1f47f7ba0/XXL' },
    ],
    created_at: '2025-12-20T10:00:00Z',
    updated_at: '2025-12-20T10:00:00Z',
  },
  {
    id: 22,
    name: 'Букет "Диантус"',
    slug: 'buket-diantus',
    description: 'Круглый букет с диантусами и эвкалиптом в стильной упаковке из фоамирана.\n\nСтойкость от 14 дней, при правильном уходе.\n\nСобираем в разной цветовой гамме.',
    price: 3250,
    original_price: null,
    best_price: 3250,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'BKT-018',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2893106/2a000001932ad46e932ac702dcaebe517ddd/XXL',
    images: [
      { id: 22, url: 'https://avatars.mds.yandex.net/get-sprav-products/2893106/2a000001932ad46e932ac702dcaebe517ddd/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 21, name: 'Букет из диантусов', slug: 'buket-iz-diantusov', price: 2150, best_price: 2150, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a000001932afcdb140507c68a1ff0eb61bb/XXL' },
      { id: 23, name: 'Сумки с диантусами', slug: 'sumki-s-diantusami', price: 2950, best_price: 2950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1643978/2a000001932ad2188c49781abb5ae9fef050/XXL' },
      { id: 6, name: 'Букет "Зефир"', slug: 'buket-zefir', price: 3650, best_price: 3650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5a6c37a59fcd0239414f2ea8/XXL' },
    ],
    created_at: '2025-12-19T10:00:00Z',
    updated_at: '2025-12-19T10:00:00Z',
  },
  {
    id: 23,
    name: 'Сумки с диантусами',
    slug: 'sumki-s-diantusami',
    description: 'Композиция в сумочке.\n\nСостав: диантус, альстромерия, рускус, лимониум/статица.\n\nСтойкость от 14 дней, при правильном уходе.\n\nСобираем в разной цветовой гамме.',
    price: 2950,
    original_price: null,
    best_price: 2950,
    has_discount: false,
    stock_quantity: 8,
    is_active: true,
    sku: 'KMP-002',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1643978/2a000001932ad2188c49781abb5ae9fef050/XXL',
    images: [
      { id: 23, url: 'https://avatars.mds.yandex.net/get-sprav-products/1643978/2a000001932ad2188c49781abb5ae9fef050/XXL', is_thumbnail: true },
    ],
    category: testCategories[1],
    metadata: null,
    related_products: [
      { id: 3, name: 'Композиция "Гера"', slug: 'kompoziciya-gera', price: 2550, best_price: 2550, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019aab6e14abc1487272d6cdf098c3/XXL' },
      { id: 21, name: 'Букет из диантусов', slug: 'buket-iz-diantusov', price: 2150, best_price: 2150, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a000001932afcdb140507c68a1ff0eb61bb/XXL' },
      { id: 22, name: 'Букет "Диантус"', slug: 'buket-diantus', price: 3250, best_price: 3250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2893106/2a000001932ad46e932ac702dcaebe517ddd/XXL' },
    ],
    created_at: '2025-12-18T10:00:00Z',
    updated_at: '2025-12-18T10:00:00Z',
  },
  {
    id: 24,
    name: 'Букет "Моно XS"',
    slug: 'buket-mono-xs',
    description: 'Букет из сортовой одноголовой хризантемы.\n\nСтойкость от 10 дней, при правильном уходе.\n\nСобираем в разных цветовых гаммах.',
    price: 2250,
    original_price: null,
    best_price: 2250,
    has_discount: false,
    stock_quantity: 15,
    is_active: true,
    sku: 'BKT-019',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1540730/2a0000019924850fa09381ab3ef1f47f7ba0/XXL',
    images: [
      { id: 24, url: 'https://avatars.mds.yandex.net/get-sprav-products/1540730/2a0000019924850fa09381ab3ef1f47f7ba0/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 25, name: 'Букет "Моно S"', slug: 'buket-mono-s', price: 2750, best_price: 2750, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/9896919/2a000001932ac63cd6c052fdd64bba1953ae/XXL' },
      { id: 21, name: 'Букет из диантусов', slug: 'buket-iz-diantusov', price: 2150, best_price: 2150, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a000001932afcdb140507c68a1ff0eb61bb/XXL' },
      { id: 16, name: 'Моно из кустовых роз', slug: 'mono-iz-kustovyh-roz', price: 3450, best_price: 3450, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/3912342/2a0000019aca4694c2e345a7b11a9af47863/XXL' },
    ],
    created_at: '2025-12-17T10:00:00Z',
    updated_at: '2025-12-17T10:00:00Z',
  },
  {
    id: 25,
    name: 'Букет "Моно S"',
    slug: 'buket-mono-s',
    description: 'Букет из сортовой одноголовой хризантемы.\n\nСтойкость от 10 дней, при правильном уходе.\n\nСобираем в разных цветовых гаммах.',
    price: 2750,
    original_price: null,
    best_price: 2750,
    has_discount: false,
    stock_quantity: 12,
    is_active: true,
    sku: 'BKT-020',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/9896919/2a000001932ac63cd6c052fdd64bba1953ae/XXL',
    images: [
      { id: 25, url: 'https://avatars.mds.yandex.net/get-sprav-products/9896919/2a000001932ac63cd6c052fdd64bba1953ae/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 24, name: 'Букет "Моно XS"', slug: 'buket-mono-xs', price: 2250, best_price: 2250, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1540730/2a0000019924850fa09381ab3ef1f47f7ba0/XXL' },
      { id: 16, name: 'Моно из кустовых роз', slug: 'mono-iz-kustovyh-roz', price: 3450, best_price: 3450, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/3912342/2a0000019aca4694c2e345a7b11a9af47863/XXL' },
      { id: 21, name: 'Букет из диантусов', slug: 'buket-iz-diantusov', price: 2150, best_price: 2150, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a000001932afcdb140507c68a1ff0eb61bb/XXL' },
    ],
    created_at: '2025-12-16T10:00:00Z',
    updated_at: '2025-12-16T10:00:00Z',
  },
  {
    id: 26,
    name: 'Букет № 1484',
    slug: 'buket-1484',
    description: 'Букет в нежных тонах, подходит для любого возраста и повода. Состоит из гортензии, кустовой пионовидной розы, альстромерии, диантуса и эвкалипта',
    price: 3650,
    original_price: null,
    best_price: 3650,
    has_discount: false,
    stock_quantity: 9,
    is_active: true,
    sku: 'BKT-021',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/1424222/2a00000190c500f4953f2666913fe00760db/XXL',
    images: [
      { id: 26, url: 'https://avatars.mds.yandex.net/get-sprav-products/1424222/2a00000190c500f4953f2666913fe00760db/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 6, name: 'Букет "Зефир"', slug: 'buket-zefir', price: 3650, best_price: 3650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019aab5a6c37a59fcd0239414f2ea8/XXL' },
      { id: 8, name: 'Букет «Первое свидание»', slug: 'buket-pervoe-svidanie', price: 3950, best_price: 3950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab293161b8acaced5d4ce75110/XXL' },
      { id: 10, name: 'Букет «Облако»', slug: 'buket-oblako', price: 3850, best_price: 3850, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019aab1dec90b0cfd2cea457ccc551/XXL' },
    ],
    created_at: '2025-12-15T10:00:00Z',
    updated_at: '2025-12-15T10:00:00Z',
  },
  {
    id: 27,
    name: 'Букет из 51 розы',
    slug: 'buket-iz-51-rozy',
    description: 'Бордовая роза сорта экслорер 70см 51 шт в упаковке',
    price: 18950,
    original_price: null,
    best_price: 18950,
    has_discount: false,
    stock_quantity: 3,
    is_active: true,
    sku: 'BKT-022',
    thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/5280674/2a0000019063c4f975777bb143bd3ac4c2d4/XXL',
    images: [
      { id: 27, url: 'https://avatars.mds.yandex.net/get-sprav-products/5280674/2a0000019063c4f975777bb143bd3ac4c2d4/XXL', is_thumbnail: true },
    ],
    category: testCategories[0],
    metadata: null,
    related_products: [
      { id: 13, name: 'Букет из белых роз', slug: 'buket-iz-belyh-roz', price: 6950, best_price: 6950, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/2808945/2a0000019aab107fd12f0b516bd5ec98fc0d/XXL' },
      { id: 14, name: 'Букет № 623', slug: 'buket-623', price: 8300, best_price: 8300, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/13944716/2a0000019a976701ad0eeeaae77574d486aa/XXL' },
      { id: 11, name: 'Букет «Мечта влюблённого»', slug: 'buket-mechta-vlyublyonnogo', price: 4650, best_price: 4650, thumbnail: 'https://avatars.mds.yandex.net/get-sprav-products/17712810/2a0000019aab1736c6b9d96246065333545d/XXL' },
    ],
    created_at: '2025-12-10T10:00:00Z',
    updated_at: '2025-12-10T10:00:00Z',
  },
]

export const testProducts: Product[] = legacyProducts.map(normalizeLegacyProduct)

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
    banner: {
      original: '/images/placeholders/bouqet.png',
      small: '/images/placeholders/bouqet.png',
    },
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
    delivery_date: '2026-01-20',
    delivery_time_slot: '12:00 - 15:00',
    pickup_point_id: null,
    notes: 'Позвонить за 30 минут до доставки',
    subtotal: 6950,
    discount: 695,
    total: 6255,
    items: [
      {
        id: 1,
        product_id: 13,
        product_name: 'Букет из белых роз',
        product_sku: 'BKT-012',
        price: 6950,
        quantity: 1,
        total: 6950,
      },
    ],
    created_at: '2026-01-19T14:30:00Z',
    updated_at: '2026-01-20T16:00:00Z',
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
    delivery_date: '2026-01-22',
    delivery_time_slot: null,
    pickup_point_id: 1,
    notes: null,
    subtotal: 8500,
    discount: 0,
    total: 8500,
    items: [
      {
        id: 2,
        product_id: 5,
        product_name: 'Букет «Танец лепестков»',
        product_sku: 'BKT-004',
        price: 4850,
        quantity: 1,
        total: 4850,
      },
      {
        id: 3,
        product_id: 6,
        product_name: 'Букет "Зефир"',
        product_sku: 'BKT-005',
        price: 3650,
        quantity: 1,
        total: 3650,
      },
    ],
    created_at: '2026-01-21T10:15:00Z',
    updated_at: '2026-01-21T10:15:00Z',
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
    delivery_date: '2026-01-25',
    delivery_time_slot: '18:00 - 21:00',
    pickup_point_id: null,
    notes: 'Не звонить - сюрприз!',
    subtotal: 18950,
    discount: 1895,
    total: 17055,
    items: [
      {
        id: 4,
        product_id: 27,
        product_name: 'Букет из 51 розы',
        product_sku: 'BKT-022',
        price: 18950,
        quantity: 1,
        total: 18950,
      },
    ],
    created_at: '2026-01-22T18:45:00Z',
    updated_at: '2026-01-22T18:45:00Z',
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
