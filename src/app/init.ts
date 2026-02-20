import type { ThemeParams } from '@tma.js/sdk-react'
import { bridge, getPlatform } from '@shared/lib/bridge'
import { THEME_PRIMARY_MAIN_BUTTON_PARAMS } from '@shared/lib/telegram'
import {
  backButton,
  emitEvent,
  initData,
  init as initSDK,
  mainButton,
  miniApp,
  mockTelegramEnv,
  retrieveLaunchParams,
  setDebug,
  themeParams,

  viewport,
} from '@tma.js/sdk-react'

const MOBILE_PLATFORMS = ['ios', 'android']

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(options: {
  debug: boolean
  mockForMacOS: boolean
  platform: string
}): Promise<void> {
  const platformName = getPlatform()
  if (platformName === 'max') {
    bridge.ready()
    return
  }

  // Set @telegram-apps/sdk-react debug mode and initialize it.
  setDebug(options.debug)
  initSDK()

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  if (options.mockForMacOS) {
    let firstThemeSent = false
    mockTelegramEnv({
      onEvent(event, next) {
        if (event.name === 'web_app_request_theme') {
          let tp: ThemeParams = {} as ThemeParams
          if (firstThemeSent) {
            tp = themeParams.state() as unknown as ThemeParams
          }
          else {
            firstThemeSent = true
            tp ||= retrieveLaunchParams().tgWebAppThemeParams as ThemeParams
          }
          return emitEvent('theme_changed', { theme_params: tp as any })
        }

        if (event.name === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', { left: 0, top: 0, right: 0, bottom: 0 })
        }

        next()
      },
    })
  }

  // Mount all components used in the project.
  backButton.mount.ifAvailable()
  initData.restore()

  if (miniApp.mount.isAvailable()) {
    themeParams.mount()
    miniApp.mount()
    themeParams.bindCssVars()
  }

  if (viewport.mount.isAvailable()) {
    viewport.mount().then(() => {
      viewport.bindCssVars()

      // Request fullscreen only on mobile platforms
      if (MOBILE_PLATFORMS.includes(options.platform) && viewport.requestFullscreen.isAvailable()) {
        viewport.requestFullscreen()
      }
    })
  }

  if (mainButton.mount.isAvailable()) {
    mainButton.mount()
    mainButton.setParams(THEME_PRIMARY_MAIN_BUTTON_PARAMS)
  }
}
