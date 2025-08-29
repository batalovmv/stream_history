import { Button, Group, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { notifications } from '@mantine/notifications'

export default function YoutubeImportPage() {
  const [input, setInput] = useState('') // ссылка или @handle
  const [loading, setLoading] = useState(false)

  const runImport = async () => {
    setLoading(true)
    try {
      const body: any = {}
      if (input.trim()) body.channelUrlOrHandle = input.trim()

      const { data, error } = await supabase.functions.invoke('youtube-sync', { body })
      if (error) throw error

      notifications.show({
        color: 'green',
        message: `Импортирован канал: ${data?.channelId ?? 'unknown'}, добавлено/обновлено: ${data?.upserted ?? 0}`,
      })
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
        <TextInput
          label="Ссылка на канал или @handle"
          placeholder="https://www.youtube.com/@LOTASbrostreams-js4cn или @LOTASbrostreams-js4cn"
          value={input}
          onChange={(e)=>setInput(e.currentTarget.value)}
          style={{ minWidth: 420 }}
        />
        <Button loading={loading} onClick={runImport}>Импортировать</Button>
      </Group>
    </section>
  )
}
