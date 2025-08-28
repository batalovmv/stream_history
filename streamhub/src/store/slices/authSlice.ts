import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: any | null
  isAdmin: boolean
  ready: boolean          // ← флаг готовности (первая синхронизация завершена)
}

const initialState: AuthState = { user: null, isAdmin: false, ready: false }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (s, a: PayloadAction<any | null>) => { s.user = a.payload },
    setIsAdmin: (s, a: PayloadAction<boolean>) => { s.isAdmin = a.payload },
    clearUser: (s) => { s.user = null; s.isAdmin = false },
    setReady: (s, a: PayloadAction<boolean>) => { s.ready = a.payload }, // ← добавили
  },
})

export const { setUser, setIsAdmin, clearUser, setReady } = slice.actions
export default slice.reducer
