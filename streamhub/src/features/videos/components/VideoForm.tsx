import { useState } from 'react'
import { Button, Group, Stack, Textarea, TextInput, TagsInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { addVideo } from '../services/videosService'


export default function VideoForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [gameSlug, setGameSlug] = useState('')
  const [desc, setDesc] = useState('')
  const [published, setPublished] = useState<string | null>(null) // Mantine dates => string|null
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const toISO = (v: string | null) => {
    if (!v) return null
    const d = new Date(v)
    return isNaN(d.getTime()) ? v : d.toISOString()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addVideo({
        title,
        youtubeUrl,
        game_slug: gameSlug || null,
        description: desc || null,
        published_at: toISO(published),
        tags,
      })
      notifications.show({ color: 'green', message: 'Видео добавлено' })
      setTitle(''); setYoutubeUrl(''); setGameSlug(''); setDesc(''); setTags([]); setPublished(null)
      onCreated?.()
    } catch (e: any) {
      notifications.show({ color: 'red', message: e.message || 'Не удалось добавить' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <Stack>
        <TextInput label="Заголовок" value={title} onChange={(e)=>setTitle(e.currentTarget.value)} required />
        <TextInput label="YouTube URL" placeholder="https://youtu.be/..." value={youtubeUrl} onChange={(e)=>setYoutubeUrl(e.currentTarget.value)} required />
        <Group align="flex-end">
          <TextInput label="Игра (slug)" placeholder="elden-ring" value={gameSlug} onChange={(e)=>setGameSlug(e.currentTarget.value)} />
          <DateTimePicker label="Дата публикации" value={published} onChange={setPublished} clearable />
        </Group>
        <TagsInput label="Теги" placeholder="Добавляйте теги и Enter" value={tags} onChange={setTags} />
        <Textarea label="Описание" value={desc} onChange={(e)=>setDesc(e.currentTarget.value)} autosize minRows={2} />
        <Group justify="flex-end">
          <Button type="submit" loading={loading}>Добавить</Button>
        </Group>
      </Stack>
    </form>
  )
}
