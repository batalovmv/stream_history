import { supabase } from '@/lib/supabaseClient'
export async function getGameBySlug(slug: string) {
    const { data, error } = await supabase.from('games').select('*').eq('slug', slug).single()
    if (error) throw error
    return data
}