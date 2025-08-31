import { Group, Anchor, Title, Menu, Button } from '@mantine/core'
import { Link } from 'react-router-dom'
import AuthButton from '@/features/auth/AuthButton'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

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

      <Group gap="md">
        {myHandle && (
          <Anchor component={Link} to={`/${myHandle}`}>Моя страница</Anchor>
        )}

        {/* доступно ЛЮБОМУ залогиненному */}
        {user && (
          <>
            <Button component={Link} to="/admin/videos/new" variant="light">
              Добавить видео
            </Button>
            <Button component={Link} to="/admin/youtube-import" variant="light">
              Импорт с YouTube
            </Button>
          </>
        )}

        {/* только администратору — оставляем админ-меню для других вещей */}
        {isAdmin && (
          <Menu>
            <Menu.Target><Button variant="default">Админ</Button></Menu.Target>
            <Menu.Dropdown>
              {/* тут оставь сугубо админские пункты, если есть */}
            </Menu.Dropdown>
          </Menu>
        )}

        <AuthButton />
      </Group>
    </Group>
  )
}
