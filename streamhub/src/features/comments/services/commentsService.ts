import { supabase } from '@/lib/supabaseClient'
import type { Comment } from '@/types'


export async function listComments(videoId: number): Promise<Comment[]> {
    const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(display_name, avatar_url)')
        .eq('video_id', videoId)
        .order('created_at', { ascending: false })
    if (error) throw error
    return (data as unknown as Comment[]) || []
}


export async function addComment({ videoId, userId, body }: { videoId: number; userId: string; body: string }): Promise<void> {
    const { error } = await supabase.from('comments').insert({ video_id: videoId, user_id: userId, body })
    if (error) throw error
}