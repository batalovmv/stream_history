import { Button, Center, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function VideoEmptyState({
    canImport = false,
    canAddUrl = false,
}: {
    canImport?: boolean
    canAddUrl?: boolean
}) {
    return (
        <Center mih={180}>
            <Stack align="center" gap="xs">
                <Text c="dimmed">Здесь пока нет видео.</Text>

                {canImport && (
                    <Button component={Link} to="/admin/youtube-import" variant="filled" size="sm">
                        Импортировать с YouTube
                    </Button>
                )}

                {canAddUrl && (
                    <Button component={Link} to="/admin/videos/new" variant="default" size="xs">
                        Добавить по URL
                    </Button>
                )}
            </Stack>
        </Center>
    )
}