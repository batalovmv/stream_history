import { Group, Anchor, Title, Menu, Button } from '@mantine/core'
import { Link } from 'react-router-dom'
import AuthButton from '@/features/auth/AuthButton'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import NotificationsBell from '@/features/notifications/components/NotificationsBell'

export default function Header() {
  const isAdmin = useSelector((s: RootState) => s.auth.isAdmin)
  const myHandle = useSelector((s: RootState) => s.auth.profile?.handle)
  const user = useSelector((s: RootState) => s.auth.user)

  return (
    <Group justify="space-between" py="md">
      <Title order={3}>
        <Anchor component={Link} to="/" c="indigo" underline="never">
          StreamHub
        </Anchor>
      </Title>

      <Group gap="sm">
        {myHandle && (
          <Anchor component={Link} to={`/u/${myHandle}`}>Моя страница</Anchor>
        )}

        {/* Импорт с YouTube — для всех авторизованных */}
        {user && (
          <Button component={Link} to="/admin/youtube-import" variant="default">
            Импорт с YouTube
          </Button>
        )}

        {/* Добавить видео — только для админа */}
        {isAdmin && (
          <Button component={Link} to="/admin/videos/new" variant="filled">
            Добавить видео
          </Button>
        )}

        {isAdmin && (
          <Menu>
            <Menu.Target><Button variant="default">Админ</Button></Menu.Target>
            <Menu.Dropdown>{/* прочие админские пункты при желании */}</Menu.Dropdown>
          </Menu>
        )}

        <NotificationsBell />
        <AuthButton />
      </Group>
    </Group>
  )
}
