export interface Bridge {
  getPlatform: () => string
  getInitData: () => string | undefined
  getInitDataUnsafe: () => Record<string, any> | undefined
  getStartParam: () => string | undefined
  ready: () => void
  close: () => void

  // BackButton
  showBackButton: () => void
  hideBackButton: () => void
  onBackButtonClick: (cb: () => void) => void
  offBackButtonClick: (cb: () => void) => void

  // Links
  openLink: (url: string, options?: { tryInstantView?: boolean }) => void

  // HapticFeedback
  hapticImpact?: (style: string) => void
}
