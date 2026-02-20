import type { Bridge } from './types'
import { getPlatform } from '../platform'
import { MaxBridge } from './max-bridge'
import { TelegramBridge } from './telegram-bridge'

export { getPlatform, isMax, isTelegram } from '../platform'
export * from './types'

let bridgeInstance: Bridge | null = null

export function initBridge(): Bridge {
  if (bridgeInstance) {
    return bridgeInstance
  }

  const platform = getPlatform()
  if (platform === 'max') {
    bridgeInstance = new MaxBridge()
  }
  else {
    bridgeInstance = new TelegramBridge()
  }

  return bridgeInstance
}

export const bridge = new Proxy({} as Bridge, {
  get(_target, prop: keyof Bridge) {
    if (!bridgeInstance) {
      initBridge()
    }
    return bridgeInstance![prop]
  },
})
