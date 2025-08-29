import { Button, Group, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { notifications } from '@mantine/notifications'

export default function YoutubeImportPage() {
  const [channelId, setChannelId] = useState('')
  const [loading, setLoading] = useState(false)

  const runImport = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('youtube-sync', {
        body: {},
        // если хочешь передавать канал динамически:
        // path: channelId ? `?channelId=${encodeURIComponent(channelId)}` : undefined,
      })
      if (error) throw error
      notifications.show({ color: 'green', message: `Импорт: ${JSON.stringify(data)}` })
    } catch (e: any) {
      notifications.show({ color: 'red', message: e.message || 'Импорт не удался' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <Title order={2} mb="md">Импорт с YouTube</Title>
      <Group align="flex-end">
        <TextInput label="Channel ID (опционально)" placeholder="UCxxxx..." value={channelId} onChange={(e)=>setChannelId(e.currentTarget.value)} />
        <Button loading={loading} onClick={runImport}>Импортировать последние видео</Button>
      </Group>
    </section>
  )
}
