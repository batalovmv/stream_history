import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Profile {
  handle?: string | null
  display_name?: string | null
  avatar_url?: string | null
}

interface AuthState {
  user: any | null
  isAdmin: boolean
  profile: Profile | null
  ready: boolean
}

const initialState: AuthState = { user: null, isAdmin: false, profile: null, ready: false }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (s, a: PayloadAction<any | null>) => { s.user = a.payload },
    setIsAdmin: (s, a: PayloadAction<boolean>) => { s.isAdmin = a.payload },
    setProfile: (s, a: PayloadAction<Profile | null>) => { s.profile = a.payload },
    clearUser: (s) => { s.user = null; s.isAdmin = false; s.profile = null },
    setReady: (s, a: PayloadAction<boolean>) => { s.ready = a.payload },
  },
})

export const { setUser, setIsAdmin, setProfile, clearUser, setReady } = slice.actions
export default slice.reducer
