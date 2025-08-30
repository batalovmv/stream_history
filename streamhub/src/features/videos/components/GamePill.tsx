import { Anchor, Avatar, Group, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function GamePill({ slug, name }: { slug?: string; name?: string }) {
    const title = name || 'Без игры'
    const initials = (title.match(/\b[\p{L}\p{N}]/gu) || []).slice(0, 2).join('').toUpperCase()

    if (!slug) {
        return (
            <Group gap="xs" wrap="nowrap">
                <Avatar radius="xl">{initials || '—'}</Avatar>
                <Text size="sm" fw={600}>{title}</Text>
            </Group>
        )
    }

    return (
        <Anchor component={Link} to={`/game/${slug}`} underline="never">
            <Group gap="xs" wrap="nowrap">
                <Avatar radius="xl">{initials || '—'}</Avatar>
                <Text size="sm" fw={600}>#{title}</Text>
            </Group>
        </Anchor>
    )
}
