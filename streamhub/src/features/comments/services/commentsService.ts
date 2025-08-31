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


export async function addComment({ videoId, body }: { videoId: number; body: string }): Promise<void> {
    const { error } = await supabase.from('comments').insert({ video_id: videoId, body })
    if (error) throw error
}

export async function addReply({ videoId, parentId, body }:
    { videoId: number; parentId: number; body: string }) {
    const { error } = await supabase.from('comments').insert({ video_id: videoId, parent_id: parentId, body })
    if (error) throw error
}

export async function removeComment(id: number) {
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (error) throw error
}

export async function getCommentCount(videoId: number) {
    const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('video_id', videoId)
    if (error) throw error
    return count ?? 0
}