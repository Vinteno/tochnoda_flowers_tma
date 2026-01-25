import { create } from 'zustand'

const HISTORY_LIMIT = 50

interface NavigationState {
  history: string[]
  record: (pathname: string) => void
  getPreviousNonSkipped: (skipRoutes: string[]) => string | null
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  history: [],
  record: (pathname) => {
    const { history } = get()
    if (history[history.length - 1] !== pathname) {
      set({ history: [...history.slice(-(HISTORY_LIMIT - 1)), pathname] })
    }
  },
  getPreviousNonSkipped: (skipRoutes) => {
    const { history } = get()
    for (let i = history.length - 2; i >= 0; i -= 1) {
      if (!skipRoutes.includes(history[i])) {
        return history[i]
      }
    }
    return null
  },
}))
