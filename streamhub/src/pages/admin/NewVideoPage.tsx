import { useState } from 'react'
import { Button, Group, Stack, TextInput, Title, Textarea } from '@mantine/core'
import { supabase } from '@/lib/supabaseClient'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'

export default function NewVideoPage() {
    const myHandle = useSelector((s: RootState) => s.auth.profile?.handle)
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [description, setDescription] = useState('')
    const [saving, setSaving] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !youtubeUrl.trim()) return

        setSaving(true)
        try {
            // author_id проставится триггером set_video_author_id()
            const { data, error } = await supabase
                .from('videos')
                .insert({
                    title: title.trim(),
                    youtube_url: youtubeUrl.trim(),
                    description: description.trim() || null,
                })
                .select('id')
                .single()

            if (error) throw error
            notifications.show({ color: 'green', message: 'Видео добавлено' })

            // ✅ редирект на свою страницу
            if (myHandle) {
                navigate(`/${myHandle}`)
            } else {
                // запасной вариант — на карточку видео
                navigate(`/video/${data!.id}`)
            }
        } catch (e: any) {
            notifications.show({ color: 'red', message: e.message ?? 'Не удалось добавить видео' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <section>
            <Title order={2} mb="md">Добавить видео</Title>
            <form onSubmit={onSubmit}>
                <Stack w={560}>
                    <TextInput
                        label="Заголовок"
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="YouTube URL"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.currentTarget.value)}
                        required
                    />
                    <Textarea
                        label="Описание"
                        value={description}
                        onChange={(e) => setDescription(e.currentTarget.value)}
                        autosize
                        minRows={3}
                    />
                    <Group justify="flex-end">
                        <Button type="submit" loading={saving}>
                            Сохранить
                        </Button>
                    </Group>
                </Stack>
            </form>
        </section>
    )
}
