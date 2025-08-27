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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </MantineProvider>
  </React.StrictMode>
)
