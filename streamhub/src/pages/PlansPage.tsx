import { useState } from 'react'
import { Button, Group, Stack, Textarea, TextInput, Title } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { notifications } from '@mantine/notifications'
import { addPlan } from '@/features/plans/services/plansService'
import PlansList from '@/features/plans/components/PlansList'

const toISO = (v: string | null): string | null => {
  if (!v) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? v : d.toISOString()
}

export default function PlansPage() {
  const isAdmin = useSelector((s: RootState) => s.auth.isAdmin)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [date, setDate] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await addPlan({
        title: title.trim(),
        body: body.trim() || null,
        scheduled_at: toISO(date),
      })
      setTitle('')
      setBody('')
      setDate(null)
      setRefreshKey(k => k + 1)
      notifications.show({ color: 'green', message: 'План добавлен' })
    } catch (err: any) {
      notifications.show({ color: 'red', message: err.message || 'Не удалось добавить' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <Title order={2} mb="md">Планы</Title>

      {isAdmin && (
        <form onSubmit={add}>
          <Stack mb="lg">
            <TextInput label="Заголовок" value={title} onChange={(e) => setTitle(e.currentTarget.value)} required />
            <Group align="flex-end">
              <DateTimePicker label="Дата и время" value={date} onChange={setDate} placeholder="Не задано" clearable />
              <Button type="submit" loading={submitting}>Добавить</Button>
            </Group>
            <Textarea label="Описание" autosize minRows={2} value={body} onChange={(e) => setBody(e.currentTarget.value)} />
          </Stack>
        </form>
      )}

      <PlansList key={refreshKey} />
    </section>
  )
}
