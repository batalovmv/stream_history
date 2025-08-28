import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface State { search: string }
const slice = createSlice({
    name: 'ui', initialState: { search: '' } as State, reducers: {
        setSearch: (s, a: PayloadAction<string>) => { s.search = a.payload },
    }
})
export const { setSearch } = slice.actions
export default slice.reducer
