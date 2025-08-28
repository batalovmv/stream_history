import { supabase } from '@/lib/supabaseClient'
import type { Video } from '@/types'


export async function listLatestVideos({ limit = 20 } = {}): Promise<Video[]> {
    const { data, error } = await supabase
        .from('videos')
        .select('*, games:game_id(name, slug)')
        .order('created_at', { ascending: false })
        .limit(limit)
    if (error) throw error
    return (data as unknown as Video[]) || []
}


export async function listVideosByGameSlug(slug: string): Promise<{ game: { id: number; name: string; slug: string } | null; videos: Video[] }> {
    const { data: g, error: ge } = await supabase.from('games').select('*').eq('slug', slug).single()
    if (ge) throw ge
    if (!g) return { game: null, videos: [] }
    const { data: vids, error } = await supabase
        .from('videos')
        .select('*, games:game_id(name, slug)')
        .eq('game_id', (g as any).id)
        .order('created_at', { ascending: false })
    if (error) throw error
    return { game: g as any, videos: (vids as unknown as Video[]) || [] }
}


export async function listAllVideos(): Promise<Video[]> {
    const { data, error } = await supabase
        .from('videos')
        .select('*, games:game_id(name, slug)')
    if (error) throw error
    return (data as unknown as Video[]) || []
}