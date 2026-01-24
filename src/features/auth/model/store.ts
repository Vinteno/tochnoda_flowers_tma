import type { AuthResponse, Customer } from '@entities/customer'
import { apiClient } from '@shared/api'
import { initData } from '@tma.js/sdk-react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: Customer | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  authenticate: () => Promise<void>
  logout: () => void
  setUser: (user: Customer) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      authenticate: async () => {
        const currentToken = get().token

        // If already authenticated with a token, just restore it
        if (currentToken) {
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
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore token to API client after rehydration
        if (state?.token) {
          apiClient.setToken(state.token)
          state.isAuthenticated = true
        }
      },
    },
  ),
)
