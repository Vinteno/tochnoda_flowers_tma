import { App, init } from '@app/index'
import { bridge, getPlatform } from '@shared/lib/bridge'
import { isTMA } from '@tma.js/sdk-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@shared/api/mock/env'

import './index.css'

async function bootstrap(): Promise<void> {
  const root = createRoot(document.getElementById('root')!)
  const platform = getPlatform()

  if (!import.meta.env.DEV && platform !== 'max' && !await isTMA('complete')) {
    window.location.replace('https://floris-app.com')
  }

  const startParam = bridge.getStartParam() || ''
  const debug = startParam.includes('debug') || import.meta.env.DEV

  let mockForMacOS = false
  if (platform !== 'max') {
    try {
      const { retrieveLaunchParams } = await import('@tma.js/sdk-react')
      mockForMacOS = retrieveLaunchParams().tgWebAppPlatform === 'macos'
    }
    catch {
      // ignore
    }
  }

  // Configure all application dependencies.
  init({
    debug,
    mockForMacOS,
    platform: bridge.getPlatform(),
  })
    .then(() => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      )
    })
    .catch(() => root.render('Не поддерживается'))
}

void bootstrap()
