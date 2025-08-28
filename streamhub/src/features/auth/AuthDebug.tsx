import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, Text, Code, Group, Button } from '@mantine/core'

export default function AuthDebug() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setEmail(data.user?.email ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null)
      setEmail(session?.user?.email ?? null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  return (
    <Card withBorder mt="md">
      <Group justify="space-between">
        <Text fw={600}>Auth debug</Text>
        <Button size="xs" variant="light" onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </Group>
      <Text size="sm" mt="xs">user.id: <Code>{userId ?? '—'}</Code></Text>
      <Text size="sm">email: <Code>{email ?? '—'}</Code></Text>
    </Card>
  )
}
