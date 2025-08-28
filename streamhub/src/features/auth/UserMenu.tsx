import { Menu, Avatar, UnstyledButton, Group, Text } from '@mantine/core'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabaseClient'
import type { RootState } from '@/store'

export default function UserMenu() {
  const user = useSelector((s: RootState) => s.auth.user)

  if (!user) return null

  const name = user.user_metadata?.full_name || user.email
  const avatar = user.user_metadata?.avatar_url as string | undefined

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('signOut error', error)
  }

  return (
    <Menu width={220} shadow="md" withinPortal>
      <Menu.Target>
        <UnstyledButton>
          <Group gap="xs">
            <Avatar src={avatar} alt={name} radius="xl" />
            <Text size="sm" fw={500} style={{ maxWidth: 140 }} lineClamp={1}>{name}</Text>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Аккаунт</Menu.Label>
        <Menu.Item onClick={signOut}>Выйти</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
