import { useState } from 'react'
import { Card, Group, Stack, Text, Title, Anchor, Badge, ActionIcon, Tooltip, Overlay } from '@mantine/core'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { Video } from '@/types'
import { youtubeThumb } from '@/utils/youtube'
import GamePill from './GamePill'
import { removeVideo } from '@/features/videos/services/videosService'
import { notifications } from '@mantine/notifications'
import { IconPencil, IconTrash, IconMessageCircle, IconBrandYoutube } from '@tabler/icons-react'
import { useNavigate, Link } from 'react-router-dom'
import LikeButton from '@/features/videos/components/LikeButton'
type Props = {
    video: Video
    onChanged?: (v: Video) => void
    onDeleted?: (id: number) => void
}

export default function VideoCard({ video, onChanged, onDeleted }: Props) {
    const isAdmin = useSelector((s: RootState) => s.auth.isAdmin)
    const [imgErr, setImgErr] = useState(false)
    const [busy, setBusy] = useState(false)
    const navigate = useNavigate()
    const published = video.published_at ? new Date(video.published_at).toLocaleString() : null
    const gameSlug = (video as any)?.games?.slug as string | undefined
    const gameName = (video as any)?.games?.name as string | undefined

    const thumbs = youtubeThumb(video.youtube_url)
    const imgSrc = imgErr ? thumbs.fallback : thumbs.primary

    const onDelete = async () => {
        if (!confirm('Удалить это видео?')) return
        setBusy(true)
        try {
            await removeVideo(video.id)
            notifications.show({ color: 'green', message: 'Видео удалено' })
            onDeleted?.(video.id)
        } catch (e: any) {
            notifications.show({ color: 'red', message: e.message || 'Не удалось удалить' })
        } finally {
            setBusy(false)
        }
    }

    return (
        <Card
            withBorder
            radius="lg"
            p={0}
            style={{ overflow: 'hidden' }}
        >
            {/* превью */}
            <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#111' }}>
                <img
                    src={imgSrc}
                    onError={() => setImgErr(true)}
                    alt={video.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                />
                {/* верхняя панель действий (только админ) */}
                {isAdmin && (
                    <>
                        <Overlay gradient="linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)" opacity={1} zIndex={1} />
                        <Group gap="xs" style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
                            <Tooltip label="Редактировать" withArrow>
                                <ActionIcon
                                    variant="filled"
                                    radius="xl"
                                    onClick={() => navigate(`/video/${video.id}/edit`)}
                                >
                                    <IconPencil size={18} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Удалить" withArrow>
                                <ActionIcon
                                    variant="filled"
                                    color="red"
                                    radius="xl"
                                    onClick={onDelete}
                                    loading={busy as unknown as boolean}
                                >
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </>
                )}

                {/* нижний градиент с заголовком и игрой */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 12,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)',
                        color: 'white',
                    }}
                >
                    <Stack gap={6} style={{ width: '100%' }}>
                        <Title order={4} style={{ lineHeight: 1.25 }}>
                            <Anchor href={video.youtube_url} target="_blank" rel="noopener noreferrer" c="gray.0" underline="never">
                                {video.title}
                            </Anchor>
                        </Title>
                        <Group justify="space-between" wrap="nowrap">
                            <GamePill slug={gameSlug} name={gameName} />
                            {published && (
                                <Badge color="gray" variant="light">
                                    {published}
                                </Badge>
                            )}
                        </Group>
                    </Stack>
                </div>
            </div>

            {/* тело карточки */}
            <Stack p="md" gap="sm">
                {video.description && (
                    <Text size="sm" c="dimmed" lineClamp={3}>
                        {video.description}
                    </Text>
                )}

                <Group gap="xs" wrap="wrap">
                    <Anchor component={Link} to={`/video/${video.id}`} underline="never">
                        <Group gap={6}>
                            <IconMessageCircle size={16} />
                            <Text size="sm">Комментарии</Text>
                        </Group>
                    </Anchor>

                    <Anchor href={video.youtube_url} target="_blank" rel="noopener noreferrer" underline="never">
                        <Group gap={6}>
                            <IconBrandYoutube size={16} />
                            <Text size="sm">YouTube</Text>
                        </Group>
                    </Anchor>

                    <LikeButton videoId={video.id} />
                </Group>
            </Stack>
        </Card>
    )
}
