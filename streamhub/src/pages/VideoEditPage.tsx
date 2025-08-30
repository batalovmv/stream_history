import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Stack, Group, TextInput, Textarea, Button, Title, Loader } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { supabase } from '@/lib/supabaseClient'
import type { Video } from '@/types'
import { updateVideo } from '@/features/videos/services/videosService'

export default function VideoEditPage() {
  const { id } = useParams()
  const videoId = useMemo(()=> Number(id), [id])
  const navigate = useNavigate()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [gameSlug, setGameSlug] = useState('')
  const [desc, setDesc] = useState('')
  const [published, setPublished] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, youtube_url, description, published_at, tags, games:game_id(slug)')
        .eq('id', videoId).single()
      setLoading(false)
      if (error) return notifications.show({ color:'red', message: error.message })
      setVideo(data as any)
      setTitle((data as any).title)
      setYoutubeUrl((data as any).youtube_url)
      setGameSlug((data as any)?.games?.slug ?? '')
      setDesc((data as any).description ?? '')
      setPublished((data as any).published_at ?? null)
      setTags(Array.isArray((data as any).tags) ? (data as any).tags : [])
    })()
  }, [videoId])

  const toISO = (v: string | null) => {
    if (!v) return null
    const d = new Date(v)
    return isNaN(d.getTime()) ? v : d.toISOString()
  }

  const save = async () => {
    setSaving(true)
    try {
      await updateVideo(videoId, {
        title, youtube_url: youtubeUrl,
        game_slug: gameSlug || null,
        description: desc || null,
        published_at: toISO(published),
        tags,
      })
      notifications.show({ color: 'green', message: 'Сохранено' })
      navigate(`/video/${videoId}`)
    } catch (e:any) {
      notifications.show({ color: 'red', message: e.message || 'Не удалось сохранить' })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !video) return <Loader />

  return (
    <section>
      <Title order={2} mb="md">Редактирование видео</Title>
      <Stack gap="sm">
        <TextInput label="Заголовок" value={title} onChange={(e)=>setTitle(e.currentTarget.value)} required />
        <TextInput label="YouTube URL" value={youtubeUrl} onChange={(e)=>setYoutubeUrl(e.currentTarget.value)} required />
        <Group align="flex-end" grow>
          <TextInput label="Игра (slug)" value={gameSlug} onChange={(e)=>setGameSlug(e.currentTarget.value)} />
          <DateTimePicker label="Дата публикации" value={published} onChange={setPublished} clearable />
        </Group>
        {/* если используешь TagsInput — подключи его сюда */}
        <Textarea label="Описание" value={desc} onChange={(e)=>setDesc(e.currentTarget.value)} autosize minRows={3} />
        <Group justify="flex-end">
          <Button variant="light" onClick={()=>navigate(-1)}>Отмена</Button>
          <Button onClick={save} loading={saving}>Сохранить</Button>
        </Group>
      </Stack>
    </section>
  )
}
