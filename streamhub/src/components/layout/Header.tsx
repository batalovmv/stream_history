import { Group, Anchor, Title, Menu, Button } from '@mantine/core'
import { Link } from 'react-router-dom'
import AuthButton from '@/features/auth/AuthButton'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export default function Header() {
  const isAdmin = useSelector((s: RootState) => s.auth.isAdmin)

  return (
    <Group justify="space-between" py="md">
      <Title order={3}>
        <Anchor component={Link} to="/" c="indigo" underline="never">
          StreamHub
        </Anchor>
      </Title>

      <Group gap="md">
        <Anchor component={Link} to="/archive">Архив</Anchor>
        <Anchor component={Link} to="/plans">Планы</Anchor>

        {isAdmin && (
          <Menu withinPortal>
            <Menu.Target>
              <Button variant="light">Админ</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={Link} to="/admin/videos/new">Добавить видео</Menu.Item>
              <Menu.Item component={Link} to="/admin/youtube-import">Импорт с YouTube</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}

        <AuthButton />
      </Group>
    </Group>
  )
}
