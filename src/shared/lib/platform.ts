export type Platform = 'telegram' | 'max' | 'unknown'

export function getPlatform(): Platform {
  if (typeof window === 'undefined') {
    return 'unknown'
  }

  const urlParams = new URLSearchParams(window.location.search)
  const hashObj = new URLSearchParams(window.location.hash.slice(1))

  const hasMaxVersion = urlParams.has('WebAppVersion') || hashObj.has('WebAppVersion')
  if (hasMaxVersion && 'WebApp' in window) {
    return 'max'
  }

  const hasTgData = urlParams.has('tgWebAppData') || hashObj.has('tgWebAppData')
  const hasTgPlatform = urlParams.has('tgWebAppPlatform') || hashObj.has('tgWebAppPlatform')
  if (hasTgData || hasTgPlatform || 'Telegram' in window) {
    return 'telegram'
  }

  return 'unknown'
}

export function isMax(): boolean {
  return getPlatform() === 'max'
}

export function isTelegram(): boolean {
  return getPlatform() === 'telegram'
}
