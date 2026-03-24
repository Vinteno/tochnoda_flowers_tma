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
  categories?: Category[]
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
    name: 'Весенние',
    slug: 'vesenniye',
    description: 'Весенняя подборка букетов',
    image_url: null,
    products_count: 5,
  },
  {
    id: 2,
    name: 'Премиум',
    slug: 'premium',
    description: 'Большие премиум букеты и композиции',
    image_url: null,
    products_count: 6,
  },
  {
    id: 3,
    name: 'Миники',
    slug: 'miniki',
    description: 'Небольшие минибукеты',
    image_url: null,
    products_count: 5,
  },
  {
    id: 4,
    name: 'Монобукеты',
    slug: 'monobukets',
    description: 'Букеты из одного вида цветов',
    image_url: null,
    products_count: 3,
  },
  {
    id: 5,
    name: 'Корзины',
    slug: 'korziny',
    description: 'Цветочные корзины и крупные композиции',
    image_url: null,
    products_count: 3,
  },
  {
    id: 6,
    name: 'Пионовидные',
    slug: 'pionovidnye',
    description: 'Букеты с пионовидными розами',
    image_url: null,
    products_count: 4,
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
  // ---- Весенние (category 0 → testCategories[0]) ----
  {
    id: 1,
    name: 'Букет из танацетума и нарциссов',
    slug: 'buket-tanacetuma-narcissov',
    description: 'Яркий, солнечный, и весенний и летний! На водичке.',
    price: 9500,
    original_price: 9500,
    best_price: 7600,
    has_discount: true,
    stock_quantity: 10,
    is_active: true,
    sku: 'V-001',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/03/IMG_0299-1.jpg',
    images: [{ id: 1, url: 'https://tochnoda.ru/wp-content/uploads/2026/03/IMG_0299-1.jpg', is_thumbnail: true }],
    category: testCategories[0],
    metadata: { size: '50x50 см' },
    related_products: [
      { id: 2, name: 'Букет из микса гвоздик', slug: 'buket-miksa-gvozdik', price: 15700, best_price: 15700, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Букет-из-микса-гвоздик.jpg' },
      { id: 3, name: 'Нежнятина', slug: 'nezhnyatina', price: 11500, best_price: 11500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Нежнятина.jpg' },
      { id: 12, name: 'Фрезия в корзине', slug: 'freziya-korzine', price: 37000, best_price: 37000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Фрезия-в-корзине-.jpg' },
    ],
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Букет из микса гвоздик',
    slug: 'buket-miksa-gvozdik',
    description: '101 кустовая. Пышный, яркий, долго стоящий микс. Букет на воде, ваза не нужна!',
    price: 15700,
    original_price: null,
    best_price: 15700,
    has_discount: false,
    stock_quantity: 8,
    is_active: true,
    sku: 'V-002',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Букет-из-микса-гвоздик.jpg',
    images: [{ id: 2, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/Букет-из-микса-гвоздик.jpg', is_thumbnail: true }],
    category: testCategories[0],
    categories: [testCategories[0], testCategories[3]],
    metadata: { size: '60x60 см' },
    related_products: [
      { id: 1, name: 'Букет из танацетума и нарциссов', slug: 'buket-tanacetuma-narcissov', price: 9500, best_price: 9500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/03/IMG_0299-1.jpg' },
      { id: 4, name: 'Букет из пионовидных роз и эустомы', slug: 'buket-pionovidnykh-roz-eustomy', price: 12300, best_price: 12300, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/02/IMG_9064.webp' },
      { id: 22, name: 'Красный минибукет', slug: 'krasnyy-minibuket', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg' },
    ],
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
  {
    id: 3,
    name: 'Нежнятина',
    slug: 'nezhnyatina',
    description: 'Самый нежный, весенний и ароматный состав. Маттиола, эустома, пионовидная роза, пионы / ранункулюсы.',
    price: 11500,
    original_price: 11500,
    best_price: 9200,
    has_discount: true,
    stock_quantity: 10,
    is_active: true,
    sku: 'V-003',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Нежнятина.jpg',
    images: [{ id: 3, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/Нежнятина.jpg', is_thumbnail: true }],
    category: testCategories[0],
    metadata: { size: '30x30 см' },
    related_products: [
      { id: 2, name: 'Букет из микса гвоздик', slug: 'buket-miksa-gvozdik', price: 15700, best_price: 15700, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Букет-из-микса-гвоздик.jpg' },
      { id: 5, name: 'Букет из сирени, дельфиниума и эустомы', slug: 'buket-sireni-delfiniuma-eustomy', price: 17500, best_price: 17500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8945.webp' },
      { id: 22, name: 'Красный минибукет', slug: 'krasnyy-minibuket', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg' },
    ],
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 4,
    name: 'Букет из пионовидных роз и эустомы',
    slug: 'buket-pionovidnykh-roz-eustomy',
    description: 'Премиум сорт. Шикарные розы, роскошный букет. В нашем чудо растворе букет простоит гораздо дольше.',
    price: 12300,
    original_price: null,
    best_price: 12300,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'V-004',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/02/IMG_9064.webp',
    images: [{ id: 4, url: 'https://tochnoda.ru/wp-content/uploads/2025/02/IMG_9064.webp', is_thumbnail: true }],
    category: testCategories[0],
    categories: [testCategories[0], testCategories[5]],
    metadata: { size: '45x40 см' },
    related_products: [
      { id: 3, name: 'Нежнятина', slug: 'nezhnyatina', price: 11500, best_price: 11500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Нежнятина.jpg' },
      { id: 6, name: 'Монобукет из ранункулюсов', slug: 'monobucket-ranunkulyusov', price: 14500, best_price: 14500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8943.jpg' },
      { id: 13, name: 'Корзина с гиацинтами и тюльпанами', slug: 'korzina-giacintami-tyulpanami', price: 35000, best_price: 35000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9976.jpg' },
    ],
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
  },
  {
    id: 5,
    name: 'Букет из сирени, дельфиниума и эустомы',
    slug: 'buket-sireni-delfiniuma-eustomy',
    description: 'Очень весенний, очень нежный. Для аллергиков – пахучий и ароматный! Букет на воде, ваза не понадобится.',
    price: 17500,
    original_price: null,
    best_price: 17500,
    has_discount: false,
    stock_quantity: 6,
    is_active: true,
    sku: 'V-005',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8945.webp',
    images: [{ id: 5, url: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8945.webp', is_thumbnail: true }],
    category: testCategories[0],
    metadata: { size: '40x60 см' },
    related_products: [
      { id: 4, name: 'Букет из пионовидных роз и эустомы', slug: 'buket-pionovidnykh-roz-eustomy', price: 12300, best_price: 12300, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/02/IMG_9064.webp' },
      { id: 7, name: 'Микс из кустовых пионовидных роз', slug: 'miks-kustovykh-pionovidnykh-roz', price: 16500, best_price: 16500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8924-scaled.webp' },
      { id: 20, name: 'Букет из сирени и дельфиниума', slug: 'buket-sireni-delfiniuma', price: 39000, best_price: 39000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9603-e1771530046666.jpg' },
    ],
    created_at: '2025-01-20T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 6,
    name: 'Монобукет из ранункулюсов',
    slug: 'monobucket-ranunkulyusov',
    description: 'Украшение: хамелациум. У нас в наличии прекрасные раники разных сортов и расцветок.',
    price: 14500,
    original_price: null,
    best_price: 14500,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'V-006',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8943.jpg',
    images: [{ id: 6, url: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8943.jpg', is_thumbnail: true }],
    category: testCategories[0],
    categories: [testCategories[0], testCategories[3]],
    metadata: { size: '30x30 см' },
    related_products: [
      { id: 5, name: 'Букет из сирени, дельфиниума и эустомы', slug: 'buket-sireni-delfiniuma-eustomy', price: 17500, best_price: 17500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8945.webp' },
      { id: 8, name: 'Букет из белых ирисов и белой сирени', slug: 'buket-belykh-irisov-beloy-sireni', price: 12500, best_price: 12500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8930.webp' },
      { id: 22, name: 'Красный минибукет', slug: 'krasnyy-minibuket', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg' },
    ],
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 7,
    name: 'Микс из кустовых пионовидных роз',
    slug: 'miks-kustovykh-pionovidnykh-roz',
    description: null,
    price: 16500,
    original_price: null,
    best_price: 16500,
    has_discount: false,
    stock_quantity: 8,
    is_active: true,
    sku: 'V-007',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8924-scaled.webp',
    images: [{ id: 7, url: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8924-scaled.webp', is_thumbnail: true }],
    category: testCategories[0],
    categories: [testCategories[0], testCategories[5]],
    metadata: { size: '50x50 см' },
    related_products: [
      { id: 6, name: 'Монобукет из ранункулюсов', slug: 'monobucket-ranunkulyusov', price: 14500, best_price: 14500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8943.jpg' },
      { id: 9, name: 'Сирень', slug: 'siren', price: 29000, best_price: 29000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_7980-e1733129637137.jpg' },
      { id: 14, name: 'Интерьерный букет из микса премиум цветов', slug: 'interierny-buket-miksa-premium', price: 39000, best_price: 39000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9592-1-1-e1771531546488.jpg' },
    ],
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 8,
    name: 'Букет из белых ирисов и белой сирени',
    slug: 'buket-belykh-irisov-beloy-sireni',
    description: 'Нежный, ароматный, весенний.',
    price: 12500,
    original_price: null,
    best_price: 12500,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'V-008',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8930.webp',
    images: [{ id: 8, url: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8930.webp', is_thumbnail: true }],
    category: testCategories[0],
    metadata: { size: '45x60 см' },
    related_products: [
      { id: 7, name: 'Микс из кустовых пионовидных роз', slug: 'miks-kustovykh-pionovidnykh-roz', price: 16500, best_price: 16500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8924-scaled.webp' },
      { id: 10, name: 'Букет из альстромерии и маттиолы', slug: 'buket-alstromerii-mattioly', price: 14700, best_price: 14700, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_5267-scaled.jpg' },
      { id: 22, name: 'Красный минибукет', slug: 'krasnyy-minibuket', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg' },
    ],
    created_at: '2025-01-05T10:00:00Z',
    updated_at: '2025-01-05T10:00:00Z',
  },
  {
    id: 9,
    name: 'Сирень',
    slug: 'siren',
    description: null,
    price: 29000,
    original_price: null,
    best_price: 29000,
    has_discount: false,
    stock_quantity: 5,
    is_active: true,
    sku: 'V-009',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_7980-e1733129637137.jpg',
    images: [{ id: 9, url: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_7980-e1733129637137.jpg', is_thumbnail: true }],
    category: testCategories[0],
    categories: [testCategories[0], testCategories[3]],
    metadata: { size: '40x50 см' },
    related_products: [
      { id: 8, name: 'Букет из белых ирисов и белой сирени', slug: 'buket-belykh-irisov-beloy-sireni', price: 12500, best_price: 12500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8930.webp' },
      { id: 11, name: 'Букет из пионовидных роз и эустомы (нежный)', slug: 'buket-pionovidnykh-roz-eustomy-2', price: 11500, best_price: 11500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8183-scaled-e1733130210485.jpg' },
      { id: 20, name: 'Букет из сирени и дельфиниума', slug: 'buket-sireni-delfiniuma', price: 39000, best_price: 39000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9603-e1771530046666.jpg' },
    ],
    created_at: '2024-09-10T10:00:00Z',
    updated_at: '2024-09-10T10:00:00Z',
  },
  {
    id: 10,
    name: 'Букет из альстромерии и маттиолы',
    slug: 'buket-alstromerii-mattioly',
    description: 'Плотная сборка, букет на воде в специальном растворе, ваза не понадобится.',
    price: 14700,
    original_price: null,
    best_price: 14700,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'V-010',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_5267-scaled.jpg',
    images: [{ id: 10, url: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_5267-scaled.jpg', is_thumbnail: true }],
    category: testCategories[0],
    metadata: { size: '40x40 см' },
    related_products: [
      { id: 9, name: 'Сирень', slug: 'siren', price: 29000, best_price: 29000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_7980-e1733129637137.jpg' },
      { id: 11, name: 'Букет из пионовидных роз и эустомы (нежный)', slug: 'buket-pionovidnykh-roz-eustomy-2', price: 11500, best_price: 11500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8183-scaled-e1733130210485.jpg' },
      { id: 12, name: 'Фрезия в корзине', slug: 'freziya-korzine', price: 37000, best_price: 37000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Фрезия-в-корзине-.jpg' },
    ],
    created_at: '2024-09-05T10:00:00Z',
    updated_at: '2024-09-05T10:00:00Z',
  },
  {
    id: 11,
    name: 'Букет из пионовидных роз и эустомы (нежный)',
    slug: 'buket-pionovidnykh-roz-eustomy-2',
    description: 'Нежный, розовый, плотно собранный букет. На воде!',
    price: 11500,
    original_price: null,
    best_price: 11500,
    has_discount: false,
    stock_quantity: 10,
    is_active: true,
    sku: 'V-011',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8183-scaled-e1733130210485.jpg',
    images: [{ id: 11, url: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8183-scaled-e1733130210485.jpg', is_thumbnail: true }],
    category: testCategories[0],
    categories: [testCategories[0], testCategories[5]],
    metadata: { size: '35x40 см' },
    related_products: [
      { id: 10, name: 'Букет из альстромерии и маттиолы', slug: 'buket-alstromerii-mattioly', price: 14700, best_price: 14700, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_5267-scaled.jpg' },
      { id: 1, name: 'Букет из танацетума и нарциссов', slug: 'buket-tanacetuma-narcissov', price: 9500, best_price: 9500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/03/IMG_0299-1.jpg' },
      { id: 22, name: 'Красный минибукет', slug: 'krasnyy-minibuket', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg' },
    ],
    created_at: '2024-09-01T10:00:00Z',
    updated_at: '2024-09-01T10:00:00Z',
  },

  // ---- Премиум (category 1 → testCategories[1]) ----
  {
    id: 12,
    name: 'Фрезия в корзине',
    slug: 'freziya-korzine',
    description: '150 нежных фрезий! Эксклюзив! Дорого, благородно, изысканно, элегантно.',
    price: 37000,
    original_price: null,
    best_price: 37000,
    has_discount: false,
    stock_quantity: 5,
    is_active: true,
    sku: 'P-001',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Фрезия-в-корзине-.jpg',
    images: [{ id: 12, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/Фрезия-в-корзине-.jpg', is_thumbnail: true }],
    category: testCategories[1],
    categories: [testCategories[1], testCategories[4]],
    metadata: { size: '35x35 см' },
    related_products: [
      { id: 13, name: 'Корзина с гиацинтами и тюльпанами', slug: 'korzina-giacintami-tyulpanami', price: 35000, best_price: 35000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9976.jpg' },
      { id: 15, name: 'Инста корзина для нее', slug: 'insta-korzina-dlya-nee', price: 55000, best_price: 55000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9600-e1771531489627.jpg' },
      { id: 1, name: 'Букет из танацетума и нарциссов', slug: 'buket-tanacetuma-narcissov', price: 9500, best_price: 9500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/03/IMG_0299-1.jpg' },
    ],
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-02-20T10:00:00Z',
  },
  {
    id: 13,
    name: 'Корзина с гиацинтами и тюльпанами',
    slug: 'korzina-giacintami-tyulpanami',
    description: '100 пионовидных тюльпанов и 50 гиацинтов в одной весенней корзине. Пахучая и тяжеленная.',
    price: 35000,
    original_price: 35000,
    best_price: 27900,
    has_discount: true,
    stock_quantity: 4,
    is_active: true,
    sku: 'P-002',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9976.jpg',
    images: [{ id: 13, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9976.jpg', is_thumbnail: true }],
    category: testCategories[1],
    categories: [testCategories[1], testCategories[4]],
    metadata: { size: '50x40 см' },
    related_products: [
      { id: 12, name: 'Фрезия в корзине', slug: 'freziya-korzine', price: 37000, best_price: 37000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Фрезия-в-корзине-.jpg' },
      { id: 14, name: 'Интерьерный букет из микса премиум цветов', slug: 'interierny-buket-miksa-premium', price: 39000, best_price: 39000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9592-1-1-e1771531546488.jpg' },
      { id: 4, name: 'Букет из пионовидных роз и эустомы', slug: 'buket-pionovidnykh-roz-eustomy', price: 12300, best_price: 12300, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/02/IMG_9064.webp' },
    ],
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-18T10:00:00Z',
  },
  {
    id: 14,
    name: 'Интерьерный букет из микса премиум цветов',
    slug: 'interierny-buket-miksa-premium',
    description: 'Шикарный, навороченный состав.',
    price: 39000,
    original_price: null,
    best_price: 39000,
    has_discount: false,
    stock_quantity: 5,
    is_active: true,
    sku: 'P-003',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9592-1-1-e1771531546488.jpg',
    images: [{ id: 14, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9592-1-1-e1771531546488.jpg', is_thumbnail: true }],
    category: testCategories[1],
    metadata: { size: '50x50 см' },
    related_products: [
      { id: 13, name: 'Корзина с гиацинтами и тюльпанами', slug: 'korzina-giacintami-tyulpanami', price: 35000, best_price: 35000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9976.jpg' },
      { id: 15, name: 'Инста корзина для нее', slug: 'insta-korzina-dlya-nee', price: 55000, best_price: 55000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9600-e1771531489627.jpg' },
      { id: 3, name: 'Нежнятина', slug: 'nezhnyatina', price: 11500, best_price: 11500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Нежнятина.jpg' },
    ],
    created_at: '2026-02-16T10:00:00Z',
    updated_at: '2026-02-16T10:00:00Z',
  },
  {
    id: 15,
    name: 'Инста корзина для нее',
    slug: 'insta-korzina-dlya-nee',
    description: 'Орхидеи, гортензии, пионовидные розы премиум сорта. Пышное облачко, тяжеленное.',
    price: 55000,
    original_price: 55000,
    best_price: 44900,
    has_discount: true,
    stock_quantity: 3,
    is_active: true,
    sku: 'P-004',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9600-e1771531489627.jpg',
    images: [{ id: 15, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9600-e1771531489627.jpg', is_thumbnail: true }],
    category: testCategories[1],
    metadata: { size: '50x50 см' },
    related_products: [
      { id: 16, name: 'Роскошная цветочная композиция в коробке', slug: 'roskoshnaya-kompoziciya-korobke', price: 47000, best_price: 47000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9602-e1771531357695.jpg' },
      { id: 21, name: '501 фрезия в корзине', slug: '501-freziya-korzine', price: 95000, best_price: 95000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/501-фрезия-в-корзине.jpg' },
      { id: 5, name: 'Букет из сирени, дельфиниума и эустомы', slug: 'buket-sireni-delfiniuma-eustomy', price: 17500, best_price: 17500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8945.webp' },
    ],
    created_at: '2026-02-14T10:00:00Z',
    updated_at: '2026-02-14T10:00:00Z',
  },
  {
    id: 16,
    name: 'Роскошная цветочная композиция в коробке',
    slug: 'roskoshnaya-kompoziciya-korobke',
    description: 'Ну это роскошь невероятная! Состав шикарный. Коробка очень тяжелая! Для любителей тяжелого люкса.',
    price: 47000,
    original_price: null,
    best_price: 47000,
    has_discount: false,
    stock_quantity: 4,
    is_active: true,
    sku: 'P-005',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9602-e1771531357695.jpg',
    images: [{ id: 16, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9602-e1771531357695.jpg', is_thumbnail: true }],
    category: testCategories[1],
    metadata: { size: '35x60 см' },
    related_products: [
      { id: 15, name: 'Инста корзина для нее', slug: 'insta-korzina-dlya-nee', price: 55000, best_price: 55000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9600-e1771531489627.jpg' },
      { id: 17, name: 'Яркий букет из протеи и микса пионовидных роз', slug: 'yarkiy-buket-protei-miksa', price: 18800, best_price: 18800, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9434-1-1.jpg' },
      { id: 2, name: 'Букет из микса гвоздик', slug: 'buket-miksa-gvozdik', price: 15700, best_price: 15700, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Букет-из-микса-гвоздик.jpg' },
    ],
    created_at: '2026-02-12T10:00:00Z',
    updated_at: '2026-02-12T10:00:00Z',
  },
  {
    id: 17,
    name: 'Яркий букет из протеи и микса пионовидных роз',
    slug: 'yarkiy-buket-protei-miksa',
    description: null,
    price: 18800,
    original_price: 18800,
    best_price: 14900,
    has_discount: true,
    stock_quantity: 8,
    is_active: true,
    sku: 'P-006',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9434-1-1.jpg',
    images: [{ id: 17, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9434-1-1.jpg', is_thumbnail: true }],
    category: testCategories[1],
    categories: [testCategories[1], testCategories[5]],
    metadata: { size: '30x40 см' },
    related_products: [
      { id: 16, name: 'Роскошная цветочная композиция в коробке', slug: 'roskoshnaya-kompoziciya-korobke', price: 47000, best_price: 47000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9602-e1771531357695.jpg' },
      { id: 18, name: 'Букет из дельфиниума и маттиолы', slug: 'buket-delfiniuma-mattioly', price: 27000, best_price: 27000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_7894-1-scaled.jpg' },
      { id: 1, name: 'Букет из танацетума и нарциссов', slug: 'buket-tanacetuma-narcissov', price: 9500, best_price: 9500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/03/IMG_0299-1.jpg' },
    ],
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 18,
    name: 'Букет из дельфиниума и маттиолы',
    slug: 'buket-delfiniuma-mattioly',
    description: 'Объемный, интерьерный, весенний. Букет приедет к вам уже на водичке в нашем спец.растворе.',
    price: 27000,
    original_price: null,
    best_price: 27000,
    has_discount: false,
    stock_quantity: 6,
    is_active: true,
    sku: 'P-007',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_7894-1-scaled.jpg',
    images: [{ id: 18, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_7894-1-scaled.jpg', is_thumbnail: true }],
    category: testCategories[1],
    metadata: { size: '50x60 см' },
    related_products: [
      { id: 17, name: 'Яркий букет из протеи и микса пионовидных роз', slug: 'yarkiy-buket-protei-miksa', price: 18800, best_price: 18800, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9434-1-1.jpg' },
      { id: 19, name: 'Весенний букет', slug: 'vesenniy-buket', price: 35000, best_price: 35000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9605-e1771530768985.jpg' },
      { id: 5, name: 'Букет из сирени, дельфиниума и эустомы', slug: 'buket-sireni-delfiniuma-eustomy', price: 17500, best_price: 17500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8945.webp' },
    ],
    created_at: '2026-02-08T10:00:00Z',
    updated_at: '2026-02-08T10:00:00Z',
  },
  {
    id: 19,
    name: 'Весенний букет',
    slug: 'vesenniy-buket',
    description: 'Роскошный состав, самые изящные весенние цветы собраны в одном букете.',
    price: 35000,
    original_price: null,
    best_price: 35000,
    has_discount: false,
    stock_quantity: 5,
    is_active: true,
    sku: 'P-008',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9605-e1771530768985.jpg',
    images: [{ id: 19, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9605-e1771530768985.jpg', is_thumbnail: true }],
    category: testCategories[1],
    metadata: { size: '50x50 см' },
    related_products: [
      { id: 18, name: 'Букет из дельфиниума и маттиолы', slug: 'buket-delfiniuma-mattioly', price: 27000, best_price: 27000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_7894-1-scaled.jpg' },
      { id: 20, name: 'Букет из сирени и дельфиниума', slug: 'buket-sireni-delfiniuma', price: 39000, best_price: 39000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9603-e1771530046666.jpg' },
      { id: 3, name: 'Нежнятина', slug: 'nezhnyatina', price: 11500, best_price: 11500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Нежнятина.jpg' },
    ],
    created_at: '2026-02-06T10:00:00Z',
    updated_at: '2026-02-06T10:00:00Z',
  },
  {
    id: 20,
    name: 'Букет из сирени и дельфиниума',
    slug: 'buket-sireni-delfiniuma',
    description: 'Роскошный эксклюзив! Букет приедет к вам уже на воде, в нашем спец.растворе, за счет чего простоит дольше!',
    price: 39000,
    original_price: null,
    best_price: 39000,
    has_discount: false,
    stock_quantity: 5,
    is_active: true,
    sku: 'P-009',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9603-e1771530046666.jpg',
    images: [{ id: 20, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9603-e1771530046666.jpg', is_thumbnail: true }],
    category: testCategories[1],
    metadata: { size: '30x40 см' },
    related_products: [
      { id: 19, name: 'Весенний букет', slug: 'vesenniy-buket', price: 35000, best_price: 35000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9605-e1771530768985.jpg' },
      { id: 21, name: '501 фрезия в корзине', slug: '501-freziya-korzine', price: 95000, best_price: 95000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/501-фрезия-в-корзине.jpg' },
      { id: 9, name: 'Сирень', slug: 'siren', price: 29000, best_price: 29000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_7980-e1733129637137.jpg' },
    ],
    created_at: '2026-02-04T10:00:00Z',
    updated_at: '2026-02-04T10:00:00Z',
  },
  {
    id: 21,
    name: '501 фрезия в корзине',
    slug: '501-freziya-korzine',
    description: 'Ну это шедевр! Корзина нереальная! Намного круче, чем розы! Изысканно невероятно. Корзина очень и очень тяжелая!',
    price: 95000,
    original_price: null,
    best_price: 95000,
    has_discount: false,
    stock_quantity: 2,
    is_active: true,
    sku: 'P-010',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/501-фрезия-в-корзине.jpg',
    images: [{ id: 21, url: 'https://tochnoda.ru/wp-content/uploads/2026/02/501-фрезия-в-корзине.jpg', is_thumbnail: true }],
    category: testCategories[1],
    categories: [testCategories[1], testCategories[4]],
    metadata: { size: '60x40 см' },
    related_products: [
      { id: 20, name: 'Букет из сирени и дельфиниума', slug: 'buket-sireni-delfiniuma', price: 39000, best_price: 39000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9603-e1771530046666.jpg' },
      { id: 15, name: 'Инста корзина для нее', slug: 'insta-korzina-dlya-nee', price: 55000, best_price: 55000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/IMG_9600-e1771531489627.jpg' },
      { id: 12, name: 'Фрезия в корзине', slug: 'freziya-korzine', price: 37000, best_price: 37000, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Фрезия-в-корзине-.jpg' },
    ],
    created_at: '2026-02-02T10:00:00Z',
    updated_at: '2026-02-02T10:00:00Z',
  },

  // ---- Миники (category 2 → testCategories[2]) ----
  {
    id: 22,
    name: 'Красный минибукет',
    slug: 'krasnyy-minibuket',
    description: 'Минибукет из пионовидных роз. Букет уже на воде, ваза не нужна, в нашем растворе букет простоит дольше.',
    price: 2500,
    original_price: 2500,
    best_price: 1900,
    has_discount: true,
    stock_quantity: 20,
    is_active: true,
    sku: 'M-001',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg',
    images: [{ id: 22, url: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg', is_thumbnail: true }],
    category: testCategories[2],
    metadata: { size: '15x20 см' },
    related_products: [
      { id: 23, name: 'Минибукет', slug: 'minibuket-1', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8179-1-scaled.jpg' },
      { id: 24, name: 'Минибукет', slug: 'minibuket-2', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_8182-1-scaled.jpg' },
      { id: 1, name: 'Букет из танацетума и нарциссов', slug: 'buket-tanacetuma-narcissov', price: 9500, best_price: 9500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/03/IMG_0299-1.jpg' },
    ],
    created_at: '2024-09-01T10:00:00Z',
    updated_at: '2024-09-01T10:00:00Z',
  },
  {
    id: 23,
    name: 'Минибукет',
    slug: 'minibuket-1',
    description: 'Минибукет из пионовидных роз. Букет уже на воде, ваза не нужна, в нашем растворе букет простоит дольше.',
    price: 2500,
    original_price: null,
    best_price: 2500,
    has_discount: false,
    stock_quantity: 20,
    is_active: true,
    sku: 'M-002',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8179-1-scaled.jpg',
    images: [{ id: 23, url: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8179-1-scaled.jpg', is_thumbnail: true }],
    category: testCategories[2],
    metadata: { size: '15x20 см' },
    related_products: [
      { id: 22, name: 'Красный минибукет', slug: 'krasnyy-minibuket', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg' },
      { id: 25, name: 'Минибукет', slug: 'minibuket-3', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_8185-1-scaled.jpg' },
      { id: 3, name: 'Нежнятина', slug: 'nezhnyatina', price: 11500, best_price: 11500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2026/02/Нежнятина.jpg' },
    ],
    created_at: '2024-09-02T10:00:00Z',
    updated_at: '2024-09-02T10:00:00Z',
  },
  {
    id: 24,
    name: 'Минибукет',
    slug: 'minibuket-2',
    description: 'Минибукет из пионовидных роз. Букет уже на воде, ваза не нужна, в нашем растворе букет простоит дольше.',
    price: 2500,
    original_price: null,
    best_price: 2500,
    has_discount: false,
    stock_quantity: 20,
    is_active: true,
    sku: 'M-003',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_8182-1-scaled.jpg',
    images: [{ id: 24, url: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_8182-1-scaled.jpg', is_thumbnail: true }],
    category: testCategories[2],
    metadata: { size: '15x20 см' },
    related_products: [
      { id: 22, name: 'Красный минибукет', slug: 'krasnyy-minibuket', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg' },
      { id: 23, name: 'Минибукет', slug: 'minibuket-1', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8179-1-scaled.jpg' },
      { id: 4, name: 'Букет из пионовидных роз и эустомы', slug: 'buket-pionovidnykh-roz-eustomy', price: 12300, best_price: 12300, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/02/IMG_9064.webp' },
    ],
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: 25,
    name: 'Минибукет',
    slug: 'minibuket-3',
    description: 'Минибукет из пионовидных роз. Букет уже на воде, ваза не нужна, в нашем растворе букет простоит дольше.',
    price: 2500,
    original_price: null,
    best_price: 2500,
    has_discount: false,
    stock_quantity: 20,
    is_active: true,
    sku: 'M-004',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_8185-1-scaled.jpg',
    images: [{ id: 25, url: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_8185-1-scaled.jpg', is_thumbnail: true }],
    category: testCategories[2],
    metadata: { size: '15x20 см' },
    related_products: [
      { id: 23, name: 'Минибукет', slug: 'minibuket-1', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8179-1-scaled.jpg' },
      { id: 26, name: 'Минибукет', slug: 'minibuket-4', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_9593.jpg' },
      { id: 6, name: 'Монобукет из ранункулюсов', slug: 'monobucket-ranunkulyusov', price: 14500, best_price: 14500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8943.jpg' },
    ],
    created_at: '2024-11-02T10:00:00Z',
    updated_at: '2024-11-02T10:00:00Z',
  },
  {
    id: 26,
    name: 'Минибукет',
    slug: 'minibuket-4',
    description: 'Минибукет из пионовидных роз. Букет уже на воде, ваза не нужна, в нашем растворе букет простоит дольше.',
    price: 2500,
    original_price: null,
    best_price: 2500,
    has_discount: false,
    stock_quantity: 20,
    is_active: true,
    sku: 'M-005',
    thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_9593.jpg',
    images: [{ id: 26, url: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_9593.jpg', is_thumbnail: true }],
    category: testCategories[2],
    metadata: { size: '15x20 см' },
    related_products: [
      { id: 22, name: 'Красный минибукет', slug: 'krasnyy-minibuket', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/09/IMG_8178-1-scaled.jpg' },
      { id: 24, name: 'Минибукет', slug: 'minibuket-2', price: 2500, best_price: 2500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2024/11/IMG_8182-1-scaled.jpg' },
      { id: 8, name: 'Букет из белых ирисов и белой сирени', slug: 'buket-belykh-irisov-beloy-sireni', price: 12500, best_price: 12500, thumbnail: 'https://tochnoda.ru/wp-content/uploads/2025/01/IMG_8930.webp' },
    ],
    created_at: '2024-11-03T10:00:00Z',
    updated_at: '2024-11-03T10:00:00Z',
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
    banner: null,
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
    filtered = filtered.filter(
      p =>
        p.category?.slug === filters.category
        || p.categories?.some(c => c.slug === filters.category),
    )
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
