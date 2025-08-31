import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Avatar, Group, Stack, Text, Title } from '@mantine/core'
import { supabase } from '@/lib/supabaseClient'
import type { Video } from '@/types'
import VideoGrid from '@/features/videos/components/VideoGrid'

export default function UserPage() {
    const { handle } = useParams()
    const [profile, setProfile] = useState<{ id: string; handle: string; display_name: string | null; avatar_url: string | null } | null>(null)
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    setLoading(true)
                    const { data: p } = await supabase
                        .from('profiles')
                        .select('id, handle, display_name, avatar_url')
                        .eq('handle', String(handle))
                        .maybeSingle()
                    if (!mounted) return
                    if (!p) { setProfile(null); setVideos([]); return setLoading(false) }
                    setProfile(p as any)

                    const { data: vids } = await supabase
                        .from('videos')
                        .select('id, title, youtube_url, description, published_at, created_at, author_id, tags, game_id, games:game_id(name, slug)')
                        .eq('author_id', (p as any).id)
                        .order('published_at', { ascending: false })
                    setVideos((vids as unknown as Video[]) ?? [])
                } finally {
                    if (mounted) setLoading(false)
                }
            })()
        return () => { mounted = false }
    }, [handle])

    if (loading) return <Text>Загрузка…</Text>
    if (!profile) return <Text>Пользователь не найден</Text>

    const initials = (profile.display_name || profile.handle || 'U').slice(0, 2).toUpperCase()

    return (
        <section>
            <Group mb="md" gap="md">
                <Avatar src={profile.avatar_url || undefined} radius="xl">{initials}</Avatar>
                <Stack gap={0}>
                    <Title order={3}>{profile.display_name || profile.handle}</Title>
                    <Text c="dimmed">@{profile.handle}</Text>
                </Stack>
            </Group>

            <Title order={4} mb="sm">Видео</Title>
            <VideoGrid videos={videos} />
        </section>
    )
}
