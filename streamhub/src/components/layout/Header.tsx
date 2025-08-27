import { Group, Anchor, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
export default function Header() {
  return (
    <Group justify="space-between" py="md">
      <Title order={3}><Anchor component={Link} to="/">StreamHub</Anchor></Title>
      <Group gap="md">
        <Anchor component={Link} to="/archive">Архив</Anchor>
        <Anchor component={Link} to="/plans">Планы</Anchor>
      </Group>
    </Group>
  )
}
