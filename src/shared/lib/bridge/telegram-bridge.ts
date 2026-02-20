import type { Bridge } from './types'
import {
  backButton,
  hapticFeedback,
  initData,
  miniApp,
  openLink,
  retrieveLaunchParams,
} from '@tma.js/sdk-react'

export class TelegramBridge implements Bridge {
  getPlatform(): string {
    try {
      return retrieveLaunchParams().tgWebAppPlatform || 'unknown'
    }
    catch {
      return 'unknown'
    }
  }

  getInitData(): string | undefined {
    return initData.raw()
  }

  getInitDataUnsafe(): Record<string, any> | undefined {
    return initData.state() as Record<string, any>
  }

  getStartParam(): string | undefined {
    try {
      return retrieveLaunchParams().tgWebAppStartParam
    }
    catch {
      return undefined
    }
  }

  ready(): void {
    if (miniApp.ready.isAvailable()) {
      miniApp.ready()
    }
  }

  close(): void {
    if (miniApp.close.isAvailable()) {
      miniApp.close()
    }
  }

  showBackButton(): void {
    if (backButton.show.isAvailable()) {
      backButton.show()
    }
  }

  hideBackButton(): void {
    if (backButton.hide.isAvailable()) {
      backButton.hide()
    }
  }

  onBackButtonClick(cb: () => void): void {
    backButton.onClick(cb)
  }

  offBackButtonClick(cb: () => void): void {
    backButton.offClick(cb)
  }

  openLink(url: string, options?: { tryInstantView?: boolean }): void {
    openLink(url, options)
  }

  hapticImpact(style: any): void {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred(style)
    }
  }
}
