import { supabase } from '@/lib/supabaseClient'

export async function getLikeCount(videoId: number) {
    const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('video_id', videoId)
    if (error) throw error
    return count ?? 0
}

export async function isLiked(videoId: number, userId: string) {
    const { data, error } = await supabase
        .from('likes')
        .select('video_id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .maybeSingle()
    if (error) throw error
    return !!data
}

export async function like(videoId: number, userId: string) {
    const { error } = await supabase.from('likes').insert({ video_id: videoId, user_id: userId })
    if (error && error.code !== '23505') throw error
}

export async function unlike(videoId: number, userId: string) {
    const { error } = await supabase.from('likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId)
    if (error) throw error
}
