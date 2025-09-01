import { Avatar, Badge, Group, Stack, Text, Title, Tooltip } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'

type Props = {
    displayName: string | null
    handle: string
    avatarUrl: string | null
    isOwner?: boolean
    videosCount?: number
}

export default function UserProfileHeader({
    displayName,
    handle,
    avatarUrl,
    isOwner = false,
    videosCount = 0,
}: Props) {
    const initials = (displayName || handle || '?').slice(0, 1).toUpperCase()

    return (
        <Group align="center" justify="space-between" wrap="nowrap" mb="md">
            <Group gap="md" wrap="nowrap">
                <Avatar src={avatarUrl || undefined} radius="xl" size={64}>
                    {initials}
                </Avatar>
                <Stack gap={2}>
                    <Group gap="xs">
                        <Title order={3} lh={1}>
                            {displayName || handle}
                        </Title>
                        {isOwner && (
                            <Tooltip label="Это вы">
                                <Badge variant="light" leftSection={<IconCheck size={12} />}>Owner</Badge>
                            </Tooltip>
                        )}
                    </Group>
                    <Text c="dimmed">@{handle}</Text>
                    <Group gap="xs" mt={2}>
                        <Badge variant="outline">Видео: {videosCount}</Badge>
                    </Group>
                </Stack>
            </Group>
        </Group>
    )
}
