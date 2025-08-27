import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice'
import ui from './slices/uiSlice'
export const store = configureStore({ reducer: { auth, ui } })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
