import { useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useNavigationStore } from './navigationStore'

export function NavigationHistoryTracker() {
  const pathname = useRouterState({ select: state => state.location.pathname })
  const record = useNavigationStore(state => state.record)

  useEffect(() => {
    record(pathname)
  }, [pathname, record])

  return null
}
