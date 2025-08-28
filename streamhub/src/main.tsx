import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'

import { store } from '@/store'
import AppRouter from '@/AppRouter'
import '@/index.css'
import { theme } from '@/theme'
import { useAuthSession } from '@/hooks/useAuthSession'

function Bootstrap() {
  console.log('[Bootstrap] mount')
  useAuthSession()
  return <AppRouter />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <Provider store={store}>
        <Bootstrap />
      </Provider>
    </MantineProvider>
  </React.StrictMode>
)
