import { backButton } from '@tma.js/sdk-react'
import { useEffect } from 'react'

/**
 * Хук для управления Telegram Back Button
 * @param onBack - callback при нажатии кнопки назад
 */
export function useBackButton(onBack: () => void) {
  useEffect(() => {
    if (backButton.show.isAvailable()) {
      backButton.show()
    }

    backButton.onClick(onBack)

    return () => {
      backButton.offClick(onBack)
      if (backButton.hide.isAvailable()) {
        backButton.hide()
      }
    }
  }, [onBack])
}
