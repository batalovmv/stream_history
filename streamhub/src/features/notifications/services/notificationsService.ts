import { supabase } from '@/lib/supabaseClient'
import type { Notification } from '@/types'

export async function listMyNotifications(limit = 20): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      id, recipient_id, actor_id, type, video_id, comment_id, created_at, read_at,
      actor:actor_id(display_name, handle, avatar_url),
      video:video_id(title)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as unknown as Notification[]) ?? []
}

export async function markNotificationRead(id: number) {
  const { error } = await supabase.from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead() {
  const { error } = await supabase.from('notifications')
    .update({ read_at: new Date().toISOString() })
    .is('read_at', null)
  if (error) throw error
}
