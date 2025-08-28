import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
if (!url || !key) throw new Error('Missing Supabase env')

export const supabase: SupabaseClient = createClient(url, key, {
    auth: {
        persistSession: true,
        storage: window.localStorage,    // одна сессия на все вкладки
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
    },
})
