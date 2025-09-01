import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Notification } from '@/types'

export function useNotifications(enabled: boolean) {
    const [items, setItems] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    setLoading(true)
                    const { data, error } = await supabase
                        .from('notifications')
                        .select(`
            id, recipient_id, actor_id, type, video_id, comment_id, created_at, read_at,
            actor:actor_id(display_name, handle, avatar_url),
            video:video_id(title)
          `)
                        .order('created_at', { ascending: false })
                        .limit(20)
                    if (error) throw error
                    if (mounted) setItems((data as any) ?? [])
                } catch (e: any) {
                    if (mounted) setError(e)
                } finally {
                    if (mounted) setLoading(false)
                }
            })()
        return () => { mounted = false }
    }, [enabled])

    useEffect(() => {
        if (!enabled) return
        const channel = supabase
            .channel('notif-insert')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
            }, (payload) => {
                setItems(prev => [payload.new as Notification, ...prev].slice(0, 50))
            })
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [enabled])

    return { items, setItems, loading, error }
}
