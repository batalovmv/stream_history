import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { Link } from 'react-router-dom'
import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core'

export default function FeedPage() {
  const handle = useSelector((s: RootState) => s.auth.profile?.handle)
  const user = useSelector((s: RootState) => s.auth.user)

  return (
    <Paper p="lg" radius="md" withBorder>
      <Stack>
        <Title order={2}>StreamHub</Title>
        <Text c="dimmed">Ваши ролики — в одном месте. Импортируйте видео с YouTube и ведите собственную ленту.</Text>
        <Group>
          {user && handle ? (
            <Button component={Link} to={`/u/${handle}`} variant="filled">Мои видео</Button>
          ) : (
            <Text c="dimmed">Войдите, чтобы перейти к своим видео.</Text>
          )}
        </Group>
      </Stack>
    </Paper>
  )
}
