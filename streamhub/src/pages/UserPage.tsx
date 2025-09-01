import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Avatar, Group, Stack, Title, Text as MText, Skeleton, Alert } from '@mantine/core'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { supabase } from '@/lib/supabaseClient'
import type { Video } from '@/types'

import UserProfileHeader from '@/features/profile/components/UserProfileHeader'
import VideoToolbar from '@/features/videos/components/VideoToolbar'
import VideoGrid from '@/features/videos/components/VideoGrid'
import VideoEmptyState from '@/features/videos/components/VideoEmptyState'

type ProfileLite = { id: string; handle: string; display_name: string | null; avatar_url: string | null }

export default function UserPage() {
    const { handle } = useParams()
    const myHandle = useSelector((s: RootState) => s.auth.profile?.handle)
    const isOwner = !!(myHandle && handle && myHandle === handle)
    const isAdmin = useSelector((s: RootState) => s.auth.isAdmin)
    const [profile, setProfile] = useState<ProfileLite | null>(null)
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // UI-состояния панели
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState<'new' | 'old'>('new')

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    setLoading(true)
                    setError(null)

                    const { data: prof, error: e1 } = await supabase
                        .from('profiles')
                        .select('id, handle, display_name, avatar_url')
                        .eq('handle', handle)
                        .single()
                    if (e1) throw e1
                    if (!prof) { setProfile(null); setVideos([]); return }
                    if (!cancelled) setProfile(prof as ProfileLite)

                    let q = supabase
                        .from('videos')
                        .select('id, title, youtube_url, description, published_at, created_at, author_id, tags, game_id, games:game_id(name, slug)')
                        .eq('author_id', (prof as ProfileLite).id)

                    // сортировка
                    if (sort === 'new') q = q.order('published_at', { ascending: false }).order('created_at', { ascending: false })
                    else q = q.order('published_at', { ascending: true }).order('created_at', { ascending: true })

                    const { data: vids, error: e2 } = await q
                    if (e2) throw e2
                    if (!cancelled) setVideos((vids as unknown as Video[]) ?? [])
                } catch (e: any) {
                    console.error(e)
                    if (!cancelled) { setError(e.message || 'Ошибка загрузки'); setProfile(null); setVideos([]) }
                } finally {
                    if (!cancelled) setLoading(false)
                }
            })()
        return () => { cancelled = true }
    }, [handle, sort])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return videos
        return videos.filter(v =>
            (v.title || '').toLowerCase().includes(q) ||
            (v.description || '').toLowerCase().includes(q)
        )
    }, [videos, query])

    if (loading) {
        return (
            <Stack>
                <Skeleton h={72} radius="md" />
                <Skeleton h={40} radius="md" />
                <Skeleton h={200} radius="md" />
            </Stack>
        )
    }
    if (error) return <Alert color="red">Ошибка: {error}</Alert>
    if (!profile) return <Alert color="yellow">Пользователь не найден.</Alert>

    return (
        <section>
            <UserProfileHeader
                displayName={profile.display_name}
                handle={profile.handle}
                avatarUrl={profile.avatar_url}
                isOwner={isOwner}
                videosCount={videos.length}
            />

            <VideoToolbar
                query={query}
                onQuery={setQuery}
                sort={sort}
                onSort={setSort}
            />

            <Title order={4} mb="sm">Видео</Title>

            {filtered.length === 0
                ? <MText c="dimmed">Здесь пока нет видео.</MText>
                : <VideoGrid videos={filtered} />
            }
        </section>
    )
}
