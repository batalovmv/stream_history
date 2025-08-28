import { Link } from 'react-router-dom'
import { AspectRatio, Text, Anchor, Stack, Badge, Group } from '@mantine/core'
import Card from '@/components/ui/Card'
import { getYouTubeId } from '@/utils/youtube'
import type { Video } from '@/types'


export default function VideoCard({ video }: { video: Video }) {
    const vid = getYouTubeId(video.youtube_url)
    return (
        <Card padding="md">
            {vid && (
                <AspectRatio ratio={16 / 9} mb="sm">
                    <iframe
                        src={`https://www.youtube.com/embed/${vid}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ border: 0, borderRadius: 8 }}
                    />
                </AspectRatio>
            )}
            <Stack gap="xs">
                <Text fw={600} size="lg" lineClamp={2}>{video.title}</Text>
                {video.games?.slug && (
                    <Group gap="xs">
                        <Badge color="indigo" variant="light" size="sm">
                            <Anchor component={Link} to={`/games/${video.games.slug}`} underline="never">{video.games.name}</Anchor>
                        </Badge>
                    </Group>
                )}
                {video.description && <Text size="sm" c="dimmed" lineClamp={2}>{video.description}</Text>}
            </Stack>
        </Card>
    )
}