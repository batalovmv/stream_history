import { supabase } from '@/lib/supabaseClient'

export type GameLite = { id: number; name: string; slug: string }

export async function searchGames(q: string, limit = 10): Promise<GameLite[]> {
    const query = q.trim()
    if (!query) return []
    const { data, error } = await supabase
        .from('games')
        .select('id, name, slug')
        .ilike('name', `%${query}%`)
        .order('name', { ascending: true })
        .limit(limit)
    if (error) throw error
    return (data || []) as GameLite[]
}

export async function getGameBySlug(slug: string): Promise<GameLite | null> {
    const { data, error } = await supabase
        .from('games')
        .select('id, name, slug')
        .eq('slug', slug)
        .maybeSingle()
    if (error) throw error
    return (data as GameLite) ?? null
}
