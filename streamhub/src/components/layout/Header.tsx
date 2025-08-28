import { Group, Anchor, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import AuthButton from '@/features/auth/AuthButton'

export default function Header() {
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
        <AuthButton />
      </Group>
    </Group>
  )
}