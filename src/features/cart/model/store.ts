import type { CartItem, CartTotals } from '@entities/cart'
import { apiClient } from '@shared/api'
import { debounce } from '@shared/lib'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  isLoading: boolean
  isSyncing: boolean
  error: string | null

  // Actions
  add: (productId: number, quantity?: number, productData?: Partial<CartItem>) => void
  update: (productId: number, quantity: number) => void
  remove: (productId: number) => void
  clear: () => void
  fetchFromServer: () => Promise<void>
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.best_price * item.quantity, 0)
  return {
    subtotal,
    discount: 0,
    total: subtotal,
  }
}

// Pending operations queue for server sync
interface PendingOperation {
  type: 'add' | 'update' | 'remove'
  productId: number
  quantity?: number
}

const pendingOperations = new Map<number, PendingOperation>()

// Debounced sync function
const debouncedSync = debounce(async (_get: () => CartState, set: (state: Partial<CartState>) => void) => {
  if (!apiClient.getToken() || pendingOperations.size === 0) {
    set({ isSyncing: false })
    return
  }

  set({ isSyncing: true, error: null })

  try {
    // Process all pending operations
    const operations = Array.from(pendingOperations.values())
    pendingOperations.clear()

    for (const op of operations) {
      try {
        if (op.type === 'add') {
          await apiClient.post('/cart', {
            product_id: op.productId,
            quantity: op.quantity,
          })
        }
        else if (op.type === 'update') {
          await apiClient.patch(`/cart/${op.productId}`, {
            quantity: op.quantity,
          })
        }
        else if (op.type === 'remove') {
          await apiClient.delete(`/cart/${op.productId}`)
        }
      }
      catch {
        // Continue with other operations even if one fails
      }
    }

    // Fetch updated cart from server to get accurate totals
    const serverCart = await apiClient.get<CartTotals>('/cart')
    set({
      items: serverCart.items,
      subtotal: serverCart.subtotal,
      discount: serverCart.discount,
      total: serverCart.total,
      isSyncing: false,
    })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed'
    set({ isSyncing: false, error: message })
  }
}, 500)

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      isLoading: false,
      isSyncing: false,
      error: null,

      add: (productId, quantity = 1, productData) => {
        const { items } = get()
        const existingItem = items.find(item => item.product_id === productId)

        // Optimistically update local state immediately
        let newItems: CartItem[]

        if (existingItem) {
          newItems = items.map(item =>
            item.product_id === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        }
        else {
          const newItem: CartItem = {
            product_id: productId,
            name: productData?.name || '',
            slug: productData?.slug || '',
            sku: productData?.sku || null,
            price: productData?.price || 0,
            best_price: productData?.best_price || productData?.price || 0,
            quantity,
            thumbnail: productData?.thumbnail || null,
          }
          newItems = [...items, newItem]
        }

        const totals = calculateTotals(newItems)
        set({ items: newItems, ...totals, error: null })

        // Queue operation for server sync
        const existingOp = pendingOperations.get(productId)
        if (existingOp && existingOp.type === 'add') {
          // Accumulate quantities for multiple adds
          existingOp.quantity = (existingOp.quantity || 0) + quantity
        }
        else if (existingOp && existingOp.type === 'update') {
          // If we have a pending update, keep it as update with new quantity
          const newQuantity = newItems.find(i => i.product_id === productId)?.quantity || quantity
          existingOp.quantity = newQuantity
        }
        else {
          pendingOperations.set(productId, { type: 'add', productId, quantity })
        }

        // Trigger debounced sync
        debouncedSync(get, set)
      },

      update: (productId, quantity) => {
        if (quantity <= 0) {
          get().remove(productId)
          return
        }

        const { items } = get()

        // Optimistically update local state immediately
        const newItems = items.map(item =>
          item.product_id === productId ? { ...item, quantity } : item,
        )

        const totals = calculateTotals(newItems)
        set({ items: newItems, ...totals, error: null })

        // Queue operation for server sync - always use the latest quantity
        pendingOperations.set(productId, { type: 'update', productId, quantity })

        // Trigger debounced sync
        debouncedSync(get, set)
      },

      remove: (productId) => {
        const { items } = get()

        // Optimistically update local state immediately
        const newItems = items.filter(item => item.product_id !== productId)

        const totals = calculateTotals(newItems)
        set({ items: newItems, ...totals, error: null })

        // Queue operation for server sync
        pendingOperations.set(productId, { type: 'remove', productId })

        // Trigger debounced sync
        debouncedSync(get, set)
      },

      clear: () => {
        pendingOperations.clear()
        set({
          items: [],
          subtotal: 0,
          discount: 0,
          total: 0,
        })
      },

      fetchFromServer: async () => {
        if (!apiClient.getToken()) {
          return
        }

        set({ isLoading: true, error: null })

        try {
          const serverCart = await apiClient.get<CartTotals>('/cart')

          set({
            items: serverCart.items,
            subtotal: serverCart.subtotal,
            discount: serverCart.discount,
            total: serverCart.total,
            isLoading: false,
          })
        }
        catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch cart'
          set({ isLoading: false, error: message })
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: state => ({
        items: state.items,
        subtotal: state.subtotal,
        discount: state.discount,
        total: state.total,
      }),
    },
  ),
)
