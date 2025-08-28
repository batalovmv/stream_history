import { useEffect, useState } from 'react'
import { ActionIcon, Badge, Button, Group, Modal, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { deletePlan, fetchPlans, updatePlan, type Plan } from '../services/plansService'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

type DateValue = string | null
const toDateLabel = (v: DateValue) => (v ? new Date(v).toLocaleString() : '')

const toISO = (v: DateValue): string | null => {
    if (!v) return null
    const d = new Date(v)
    return isNaN(d.getTime()) ? v : d.toISOString()
}

export default function PlansList() {
    const isAdmin = useSelector((s: RootState) => s.auth.isAdmin)
    const [items, setItems] = useState<Plan[]>([])
    const [loading, setLoading] = useState(false)

    const [opened, setOpened] = useState(false)
    const [edit, setEdit] = useState<Plan | null>(null)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [date, setDate] = useState<DateValue>(null)

    const load = async () => {
        setLoading(true)
        try {
            const data = await fetchPlans(100)
            setItems(data)
        } catch (e: any) {
            notifications.show({ color: 'red', message: e.message || 'Ошибка загрузки планов' })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { void load() }, [])

    const startEdit = (p: Plan) => {
        setEdit(p)
        setTitle(p.title)
        setBody(p.body ?? '')
        setDate(p.scheduled_at) // ← строка или null
        setOpened(true)
    }

    const saveEdit = async () => {
        if (!edit) return
        try {
            const updated = await updatePlan(edit.id, {
                title: title.trim(),
                body: body.trim(),
                scheduled_at: toISO(date),
            })
            setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)))
            notifications.show({ color: 'green', message: 'План обновлён' })
            setOpened(false)
        } catch (e: any) {
            notifications.show({ color: 'red', message: e.message || 'Не удалось обновить' })
        }
    }

    const remove = async (id: number) => {
        if (!confirm('Удалить этот план?')) return
        try {
            await deletePlan(id)
            setItems(prev => prev.filter(i => i.id !== id))
            notifications.show({ color: 'green', message: 'План удалён' })
        } catch (e: any) {
            notifications.show({ color: 'red', message: e.message || 'Не удалось удалить' })
        }
    }

    return (
        <>
            <Stack gap="sm" mt="md">
                {items.length === 0 && !loading && <Text c="dimmed">Пока нет планов…</Text>}

                {items.map(p => (
                    <Group key={p.id} justify="space-between" wrap="nowrap">
                        <div style={{ minWidth: 0 }}>
                            {p.scheduled_at && (
                                <Badge variant="light">{toDateLabel(p.scheduled_at)}</Badge>
                            )}
                            <Text fw={600} lineClamp={1}>{p.title}</Text>
                            {p.body && <Text size="sm" c="dimmed" lineClamp={2}>{p.body}</Text>}
                        </div>

                        {isAdmin && (
                            <Group gap="xs">
                                <ActionIcon variant="light" aria-label="Редактировать" onClick={() => startEdit(p)}>
                                    <IconPencil size={18} />
                                </ActionIcon>
                                <ActionIcon color="red" variant="light" aria-label="Удалить" onClick={() => void remove(p.id)}>
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Group>
                        )}
                    </Group>
                ))}
            </Stack>

            <Modal opened={opened} onClose={() => setOpened(false)} title="Редактирование плана" centered>
                <Stack>
                    <TextInput label="Заголовок" value={title} onChange={(e) => setTitle(e.currentTarget.value)} required />
                    <Group align="flex-end">
                        <DateTimePicker
                            label="Дата и время"
                            value={date}
                            onChange={setDate}          // ← теперь типы совпадают
                            placeholder="Не задано"
                            clearable
                        />
                    </Group>
                    <Textarea label="Описание" autosize minRows={2} value={body} onChange={(e) => setBody(e.currentTarget.value)} />
                    <Group justify="flex-end" mt="sm">
                        <Button variant="default" onClick={() => setOpened(false)}>Отмена</Button>
                        <Button onClick={() => void saveEdit()}>Сохранить</Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    )
}
