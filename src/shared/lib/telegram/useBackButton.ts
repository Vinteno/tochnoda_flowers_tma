import { backButton } from '@tma.js/sdk-react'
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigationStore } from './navigationStore'

/**
 * Хук для управления Telegram Back Button
 * @param optionsOrHandler - callback или настройки поведения
 */
export interface BackButtonOptions {
  onBack?: () => void
  navigate?: (options: { to: string }) => void
  skipRoutes?: string[]
  fallbackTo?: string
}

export function useBackButton(optionsOrHandler: BackButtonOptions | (() => void)) {
  const options = typeof optionsOrHandler === 'function'
    ? { onBack: optionsOrHandler }
    : optionsOrHandler

  const onBack = options?.onBack
  const navigate = options?.navigate
  const skipRoutes = useMemo(() => options?.skipRoutes ?? [], [options?.skipRoutes])
  const fallbackTo = options?.fallbackTo ?? '/'

  const getPreviousNonSkipped = useNavigationStore(state => state.getPreviousNonSkipped)

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack()
      return
    }

    if (!navigate) {
      return
    }

    const target = getPreviousNonSkipped(skipRoutes)
    if (target) {
      navigate({ to: target })
      return
    }

    navigate({ to: fallbackTo })
  }, [fallbackTo, getPreviousNonSkipped, navigate, onBack, skipRoutes])

  useEffect(() => {
    if (backButton.show.isAvailable()) {
      backButton.show()
    }

    backButton.onClick(handleBack)

    return () => {
      backButton.offClick(handleBack)
      if (backButton.hide.isAvailable()) {
        backButton.hide()
      }
    }
  }, [handleBack])
}
