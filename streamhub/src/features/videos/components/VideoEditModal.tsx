import { useEffect, useState } from 'react'
import { Modal, Stack, Group, TextInput, Textarea, Button, TagsInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import type { Video } from '@/types'
import { updateVideo } from '@/features/videos/services/videosService'

type Props = {
  opened: boolean
  onClose: () => void
  video: Video
  onSaved?: (v: Video) => void
}

export default function VideoEditModal({ opened, onClose, video, onSaved }: Props) {
  const [title, setTitle] = useState(video.title)
  const [youtubeUrl, setYoutubeUrl] = useState(video.youtube_url)
  const [gameSlug, setGameSlug] = useState<string>((video as any)?.games?.slug ?? '')
  const [desc, setDesc] = useState<string>(video.description ?? '')
  const [published, setPublished] = useState<string | null>(video.published_at ?? null)
  const [tags, setTags] = useState<string[]>(Array.isArray(video.tags) ? video.tags : [])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setTitle(video.title)
    setYoutubeUrl(video.youtube_url)
    setGameSlug((video as any)?.games?.slug ?? '')
    setDesc(video.description ?? '')
    setPublished(video.published_at ?? null)
    setTags(Array.isArray(video.tags) ? video.tags : [])
  }, [video])

  const toISO = (v: string | null) => {
    if (!v) return null
    const d = new Date(v)
    return isNaN(d.getTime()) ? v : d.toISOString()
  }

  const save = async () => {
    setSaving(true)
    try {
      const v = await updateVideo(video.id, {
        title,
        youtube_url: youtubeUrl,
        game_slug: gameSlug || null,
        description: desc || null,
        published_at: toISO(published),
        tags,
      })
      notifications.show({ color: 'green', message: 'Видео обновлено' })
      onSaved?.(v)
      onClose()
    } catch (e: any) {
      notifications.show({ color: 'red', message: e.message || 'Не удалось обновить' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Редактирование видео" centered>
      <Stack>
        <TextInput label="Заголовок" value={title} onChange={(e)=>setTitle(e.currentTarget.value)} required />
        <TextInput label="YouTube URL" value={youtubeUrl} onChange={(e)=>setYoutubeUrl(e.currentTarget.value)} required />
        <Group align="flex-end">
          <TextInput label="Игра (slug)" value={gameSlug} onChange={(e)=>setGameSlug(e.currentTarget.value)} />
          <DateTimePicker label="Дата публикации" value={published} onChange={setPublished} clearable />
        </Group>
        <TagsInput label="Теги" value={tags} onChange={setTags} />
        <Textarea label="Описание" value={desc} onChange={(e)=>setDesc(e.currentTarget.value)} autosize minRows={2} />
        <Group justify="flex-end">
          <Button variant="light" onClick={onClose}>Отмена</Button>
          <Button onClick={save} loading={saving}>Сохранить</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
