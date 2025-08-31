import { Menu, Avatar, UnstyledButton, Group, Text, Button } from '@mantine/core'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabaseClient'
import type { RootState } from '@/store'
import { useEffect } from 'react'

export default function AuthButton() {
    const user = useSelector((s: RootState) => s.auth.user)

    useEffect(() => {
        console.log('AuthButton user changed =>', user?.id ?? null)
    }, [user])

    const signIn = async () => {
        const base = import.meta.env.BASE_URL.replace(/\/$/, '')
        const redirectTo = `${window.location.origin}${base}/`

        // ОБЯЗАТЕЛЬНО добавь youtube.readonly
        const scopes = 'openid email profile https://www.googleapis.com/auth/youtube.readonly'

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                scopes,
                // форсируем повторное согласие, чтобы выдали новый токен со скоупом
                queryParams: {
                    prompt: 'consent',
                    access_type: 'offline',
                },
            },
        })
        if (error) console.error(error)
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('signOut error:', error)
    }

    if (!user) return <Button onClick={signIn}>Войти с Google</Button>

    const name = user.user_metadata?.full_name || user.email
    const avatar = user.user_metadata?.avatar_url as string | undefined

    return (
        <Menu width={220} shadow="md" withinPortal>
            <Menu.Target>
                <UnstyledButton>
                    <Group gap="xs">
                        <Avatar src={avatar} alt={name} radius="xl" />
                        <Text size="sm" fw={500} style={{ maxWidth: 140 }} lineClamp={1}>
                            {name}
                        </Text>
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
