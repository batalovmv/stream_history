import { useEffect, useState } from 'react'
import { Button, Group, Stack, TextInput, Title } from '@mantine/core'
import { supabase } from '@/lib/supabaseClient'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { notifications } from '@mantine/notifications'

export default function ProfileSettingsPage() {
    const user = useSelector((s: RootState) => s.auth.user)
    const [displayName, setDisplayName] = useState('')
    const [handle, setHandle] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        (async () => {
            const { data } = await supabase.from('profiles').select('display_name, handle').eq('id', user.id).single()
            setDisplayName((data as any)?.display_name ?? '')
            setHandle((data as any)?.handle ?? '')
        })()
    }, [user?.id])

    const save = async () => {
        setSaving(true)
        try {
            const { error } = await supabase.from('profiles')
                .update({ display_name: displayName || null, handle: handle || null })
                .eq('id', user.id)
            if (error) throw error
            notifications.show({ color: 'green', message: 'Профиль обновлён' })
        } catch (e: any) {
            if (e?.code === '23505') {
                notifications.show({ color: 'red', message: 'Никнейм уже занят' })
            } else {
                notifications.show({ color: 'red', message: e.message || 'Ошибка сохранения' })
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <section>
            <Title order={2} mb="md">Профиль</Title>
            <Stack w={420}>
                <TextInput label="Никнейм (для URL)" value={handle} onChange={(e) => setHandle(e.currentTarget.value)} />
                <TextInput label="Отображаемое имя" value={displayName} onChange={(e) => setDisplayName(e.currentTarget.value)} />
                <Group justify="flex-end">
                    <Button onClick={save} loading={saving}>Сохранить</Button>
                </Group>
            </Stack>
        </section>
    )
}
