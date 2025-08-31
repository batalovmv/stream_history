import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Anchor, Group, Stack, Text, Image, ActionIcon, Tooltip } from '@mantine/core'
import { IconBrandYoutube, IconMessageCircle, IconPencil, IconTrash } from '@tabler/icons-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

import Card from '@/components/ui/Card'
import GamePill from '@/features/videos/components/GamePill'
import LikeButton from '@/features/videos/components/LikeButton'

import type { Video } from '@/types'
import { youtubeThumb } from '@/utils/youtube'
import { getCommentCount } from '@/features/comments/services/commentsService'
import { removeVideo } from '@/features/videos/services/videosService'

export default function VideoCard({ video }: { video: Video }) {
    const navigate = useNavigate()
    const me = useSelector((s: RootState) => s.auth.user)
    const isAdmin = useSelector((s: RootState) => s.auth.isAdmin)
    const canEdit = !!me && (isAdmin || me.id === video.author_id)

    const [commentCount, setCommentCount] = useState(0)

    const { primary, fallback } = youtubeThumb(video.youtube_url || '')
    const [thumbSrc, setThumbSrc] = useState(primary)
    useEffect(() => { setThumbSrc(primary) }, [primary])

    useEffect(() => { getCommentCount(video.id).then(setCommentCount).catch(() => { }) }, [video.id])

    const onDelete = async () => {
        if (!confirm('Удалить видео?')) return
        try { await removeVideo(video.id) } catch { /* можно показать notifications */ }
    }

    return (
        <Card>
            <Stack gap="xs">
                {/* кликабельное превью */}
                <Anchor component={Link} to={`/video/${video.id}`} underline="never">
                    <Image
                        src={thumbSrc}
                        radius="md"
                        alt={video.title}
                        onError={() => setThumbSrc(fallback)}
                    />
                </Anchor>

                {/* кликабельный заголовок */}
                <Anchor component={Link} to={`/video/${video.id}`} underline="never">
                    <Text fw={600}>{video.title}</Text>
                </Anchor>

                {/* игра — кликабельная плашка */}
                {video?.games?.slug && <GamePill slug={video.games.slug} name={video.games.name} />}

                <Group justify="space-between" wrap="wrap">
                    <Group gap="sm">
                        {/* комментарии с количеством */}
                        <Anchor component={Link} to={`/video/${video.id}#comments`} underline="never">
                            <Group gap={6}>
                                <IconMessageCircle size={16} />
                                <Text size="sm">Комментарии{commentCount ? ` • ${commentCount}` : ''}</Text>
                            </Group>
                        </Anchor>

                        {/* youtube */}
                        <Anchor href={video.youtube_url} target="_blank" rel="noopener noreferrer" underline="never">
                            <Group gap={6}>
                                <IconBrandYoutube size={16} />
                                <Text size="sm">YouTube</Text>
                            </Group>
                        </Anchor>

                        {/* лайк */}
                        <LikeButton videoId={video.id} />
                    </Group>

                    {/* действия — только автор/админ */}
                    {canEdit && (
                        <Group gap="xs">
                            <Tooltip label="Изменить">
                                <ActionIcon variant="light" onClick={() => navigate(`/video/${video.id}/edit`)}>
                                    <IconPencil size={16} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Удалить">
                                <ActionIcon variant="light" color="red" onClick={onDelete}>
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    )}
                </Group>
            </Stack>
        </Card>
    )
}
