import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
type Status = 'idle' | 'loading' | 'error'
interface State { user: any | null; isAdmin: boolean; status: Status }
const initial: State = { user: null, isAdmin: false, status: 'idle' }
const slice = createSlice({
    name: 'auth', initialState: initial, reducers: {
        setUser: (s, a: PayloadAction<any | null>) => { s.user = a.payload },
        setIsAdmin: (s, a: PayloadAction<boolean>) => { s.isAdmin = a.payload },
        clearUser: (s) => { s.user = null; s.isAdmin = false },
        setStatus: (s, a: PayloadAction<Status>) => { s.status = a.payload },
    }
})
export const { setUser, setIsAdmin, clearUser, setStatus } = slice.actions
export default slice.reducer