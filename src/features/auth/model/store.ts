import type { AuthResponse, Customer } from '@entities/customer'
import { useCartStore } from '@features/cart'
import { apiClient } from '@shared/api'
import { initData } from '@tma.js/sdk-react'
import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const isTokenValid = (token: string): boolean => {
  try {
    const payload = jwtDecode<{ exp?: number }>(token)
    if (!payload?.exp) {
      return false
    }
    const now = Math.floor(Date.now() / 1000)
    return payload.exp > now
  }
  catch {
    return false
  }
}

let authInFlight: Promise<void> | null = null

interface AuthState {
  token: string | null
  user: Customer | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  authenticate: (options?: { force?: boolean, resetCart?: boolean }) => Promise<void>
  ensureValidToken: () => Promise<boolean>
  handleUnauthorized: () => void
  logout: () => void
  setUser: (user: Customer) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const runAuth = async (options: { force?: boolean, resetCart?: boolean } = {}) => {
        if (authInFlight) {
          await authInFlight
          return
        }

        authInFlight = (async () => {
          const currentToken = get().token
          const tokenValid = currentToken ? isTokenValid(currentToken) : false

          if (tokenValid && !options.force) {
            apiClient.setToken(currentToken)
            set({ isAuthenticated: true, isLoading: false })
            return
          }

          set({ isLoading: true, error: null })

          try {
            // Get raw initData from Telegram Mini App
            const rawInitData = initData.raw()

            if (!rawInitData) {
              throw new Error('No init data available')
            }

            // Authenticate with backend
            const response = await apiClient.post<AuthResponse>('/auth/telegram', {
              init_data: rawInitData,
            })

            // Store token in API client
            apiClient.setToken(response.token)

            set({
              token: response.token,
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })

            if (options.resetCart) {
              await useCartStore.getState().resetAfterAuth()
            }
          }
          catch (error) {
            const message = error instanceof Error ? error.message : 'Authentication failed'
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: message,
            })
            apiClient.setToken(null)
          }
        })()

        try {
          await authInFlight
        }
        finally {
          authInFlight = null
        }
      }

      return {
        token: null,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,

        authenticate: async (options) => {
          await runAuth(options)
        },

        ensureValidToken: async () => {
          const currentToken = get().token
          const tokenValid = currentToken ? isTokenValid(currentToken) : false
          const shouldResetCart = Boolean(currentToken) && !tokenValid

          await runAuth({ force: !tokenValid, resetCart: shouldResetCart })
          return shouldResetCart
        },

        handleUnauthorized: () => {
          void runAuth({ force: true, resetCart: true })
        },

        logout: () => {
          apiClient.setToken(null)
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            error: null,
          })
        },

        setUser: (user: Customer) => {
          set({ user })
        },
      }
    },
    {
      name: 'auth-storage',
      partialize: state => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore token to API client after rehydration
        if (state?.token && isTokenValid(state.token)) {
          apiClient.setToken(state.token)
          state.isAuthenticated = true
          state.error = null
        }
        else if (state?.token) {
          state.token = null
          state.user = null
          state.isAuthenticated = false
          state.error = null
          apiClient.setToken(null)
        }
      },
    },
  ),
)

apiClient.onUnauthorized(() => {
  useAuthStore.getState().handleUnauthorized()
})
