import { bridge } from '@shared/lib/bridge'
import { useEffect } from 'react'

/**
 * Хук для управления Back Button
 * @param onBack - callback при нажатии кнопки назад
 */
export function useBackButton(onBack: () => void) {
  useEffect(() => {
    bridge.showBackButton()

    bridge.onBackButtonClick(onBack)

    return () => {
      bridge.offBackButtonClick(onBack)
      bridge.hideBackButton()
    }
  }, [onBack])
}
