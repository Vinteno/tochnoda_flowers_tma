import { App, init } from '@app/index'
import { retrieveLaunchParams } from '@tma.js/sdk-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@shared/api/mock/env'

import './index.css'

const root = createRoot(document.getElementById('root')!)

const launchParams = retrieveLaunchParams()
const { tgWebAppPlatform: platform } = launchParams
const debug = (launchParams.tgWebAppStartParam || '').includes('debug')
  || import.meta.env.DEV

// Configure all application dependencies.
init({
  debug,
  mockForMacOS: platform === 'macos',
  platform,
})
  .then(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch(() => root.render('Не поддерживается'))
