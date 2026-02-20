import type { Bridge } from './types'

export class MaxBridge implements Bridge {
  private get webApp() {
    return (window as any).WebApp
  }

  getPlatform(): string {
    return this.webApp?.platform || 'max'
  }

  getInitData(): string | undefined {
    return this.webApp?.initData
  }

  getInitDataUnsafe(): Record<string, any> | undefined {
    return this.webApp?.initDataUnsafe
  }

  getStartParam(): string | undefined {
    return this.webApp?.initDataUnsafe?.start_param
  }

  ready(): void {
    this.webApp?.ready?.()
  }

  close(): void {
    this.webApp?.close?.()
  }

  showBackButton(): void {
    this.webApp?.BackButton?.show?.()
  }

  hideBackButton(): void {
    this.webApp?.BackButton?.hide?.()
  }

  onBackButtonClick(cb: () => void): void {
    this.webApp?.BackButton?.onClick?.(cb)
  }

  offBackButtonClick(cb: () => void): void {
    this.webApp?.BackButton?.offClick?.(cb)
  }

  openLink(url: string, _options?: { tryInstantView?: boolean }): void {
    // MAX openLink doesn't support options like tryInstantView
    this.webApp?.openLink?.(url)
  }

  hapticImpact(_style: string): void {
    // Not supported in MAX currently
  }
}
