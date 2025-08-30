import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Alert, Anchor, Card, Group, Loader, Stack, Text, Title, Badge } from '@mantine/core'
import { supabase } from '@/lib/supabaseClient'
import type { Video } from '@/types'
import { extractYoutubeId } from '@/utils/youtube'
import CommentThread from '@/features/comments/components/CommentThread'
import LikeButton from '@/features/videos/components/LikeButton'

export default function VideoPage() {
    const { id } = useParams()
    const videoId = useMemo(() => Number(id), [id])
    const [video, setVideo] = useState<Video | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        ; (async () => {
            if (!videoId) return
            setLoading(true)
            setError(null)
            try {
                const { data, error } = await supabase
                    .from('videos')
                    .select('id, title, youtube_url, description, published_at, created_at, tags, game_id, games:game_id(name, slug)')
                    .eq('id', videoId)
                    .single()
                if (error) throw error
                setVideo(data as unknown as Video)
            } catch (e: any) {
                setError(e?.message || 'Видео не найдено')
            } finally {
                setLoading(false)
            }
        })()
    }, [videoId])

    if (loading) return <Group justify="center" my="xl"><Loader /></Group>
    if (error) return <Alert color="red">{error}</Alert>
    if (!video) return null

    const gameSlug = (video as any)?.games?.slug as string | undefined
    const gameName = (video as any)?.games?.name as string | undefined

    const vid = extractYoutubeId(video.youtube_url)
    const embedUrl = vid ? `https://www.youtube.com/embed/${vid}` : undefined

    return (
        <section>
            <Title order={2} mb="xs">{video.title}</Title>
            <Group gap="sm" mb="sm">
                {gameSlug && (
                    <Badge variant="light">
                        <Anchor component={Link} to={`/game/${gameSlug}`} underline="never">#{gameName}</Anchor>
                    </Badge>
                )}
                {video.published_at && (
                    <Text size="sm" c="dimmed">{new Date(video.published_at).toLocaleString()}</Text>
                )}
                <LikeButton videoId={videoId} />
            </Group>

            {embedUrl ? (
                <Card withBorder radius="md" mb="md" p={0} style={{ overflow: 'hidden' }}>
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                        <iframe
                            src={embedUrl}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                        />
                    </div>
                </Card>
            ) : (
                <Anchor href={video.youtube_url} target="_blank" rel="noopener noreferrer">Открыть на YouTube</Anchor>
            )}

            {video.description && (
                <Text mb="md" style={{ whiteSpace: 'pre-wrap' }}>{video.description}</Text>
            )}

            <CommentThread videoId={videoId} />
        </section>
    )
}
