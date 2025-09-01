import { useEffect, useMemo, useState } from 'react'
import { ActionIcon, Badge, Box, Loader, Menu, Stack, Text, Group, Avatar, Button } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { markAllNotificationsRead } from '@/features/notifications/services/notificationsService'
import type { Notification } from '@/types'
import { Link } from 'react-router-dom'

function renderText(n: Notification) {
    const who = n.actor?.display_name || n.actor?.handle || 'Пользователь'
    const title = n.video?.title || 'ваше видео'
    if (n.type === 'LIKE_VIDEO') return `${who} поставил лайк: «${title}»`
    if (n.type === 'COMMENT_VIDEO') return `${who} оставил комментарий под «${title}»`
    if (n.type === 'REPLY_COMMENT') return `${who} ответил на ваш комментарий`
    return 'Уведомление'
}

function linkFor(n: Notification) {
    if (n.video_id) {
        // проверь маршрут к странице видео
        return `/video/${n.video_id}` + (n.comment_id ? `#comment-${n.comment_id}` : '')
    }
    return '#'
}

export default function NotificationsBell() {
    const user = useSelector((s: RootState) => s.auth.user)
    const { items, loading } = useNotifications(!!user)
    const unread = useMemo(() => items.filter(i => !i.read_at).length, [items])
    const [busy, setBusy] = useState(false)

    if (!user) return null

    return (
        <Menu width={360} position="bottom-end" withinPortal>
            <Menu.Target>
                <Box pos="relative">
                    <ActionIcon variant="default" aria-label="Уведомления">
                        <IconBell size={18} />
                    </ActionIcon>
                    {unread > 0 && (
                        <Badge pos="absolute" top={-6} right={-6} size="xs" variant="filled">
                            {unread}
                        </Badge>
                    )}
                </Box>
            </Menu.Target>
            <Menu.Dropdown>
                <Group justify="space-between" px="sm" py={6}>
                    <Text fw={600}>Уведомления</Text>
                    <Button size="xs" variant="subtle" onClick={async () => {
                        try { setBusy(true); await markAllNotificationsRead() } finally { setBusy(false) }
                    }} disabled={unread === 0}>
                        Прочитать всё
                    </Button>
                </Group>
                <Menu.Divider />
                <Box px="xs" pb="xs">
                    {loading ? (
                        <Group justify="center" py="md"><Loader size="sm" /></Group>
                    ) : (
                        <Stack gap="xs">
                            {items.length === 0 && <Text c="dimmed" ta="center">Пока пусто</Text>}
                            {items.map(n => (
                                <Group key={n.id} align="flex-start" gap="sm" component={Link} to={linkFor(n)} style={{ textDecoration: 'none' }}>
                                    <Avatar src={n.actor?.avatar_url || undefined} radius="xl" size="sm" />
                                    <Stack gap={0} style={{ flex: 1 }}>
                                        <Text size="sm">{renderText(n)}</Text>
                                        <Text size="xs" c="dimmed">{new Date(n.created_at).toLocaleString()}</Text>
                                    </Stack>
                                    {!n.read_at && <Badge size="xs">new</Badge>}
                                </Group>
                            ))}
                        </Stack>
                    )}
                </Box>
                {busy && <Menu.Label><Text size="xs">Обновляем…</Text></Menu.Label>}
            </Menu.Dropdown>
        </Menu>
    )
}
