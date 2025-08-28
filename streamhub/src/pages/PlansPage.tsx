import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Stack, Textarea, TextInput, Button, Group, Title } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { listPlans, createPlan } from '@/features/plans/services/plansService'
import type { RootState } from '@/store'
import type { Plan } from '@/types'

export default function PlansPage() {
    const isAdmin = useSelector((s: RootState) => s.auth.isAdmin)

    const [plans, setPlans] = useState<Plan[]>([])
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    // ключевая правка: string | null, не Date
    const [date, setDate] = useState<string | null>(null)

    const load = async () => setPlans(await listPlans())

    useEffect(() => {
        load()
    }, [])

    const add = async (e: React.FormEvent) => {
        e.preventDefault()
        await createPlan({
            title,
            body,
            scheduled_at: date ?? undefined, // ISO-строка или undefined
        })
        setTitle('')
        setBody('')
        setDate(null)
        load()
    }

    return (
        <section>
            <Title order={2} mb="md">Планы и расписание</Title>

            {isAdmin && (
                <form onSubmit={add}>
                    <Stack mb="md">
                        <TextInput
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                            placeholder="Заголовок"
                            required
                        />

                        <Group align="flex-end">
                            <DateTimePicker
                                value={date}               // string | null
                                onChange={setDate}         // (value: string | null) => void
                                placeholder="Дата и время"
                            />
                            <Button type="submit">Добавить</Button>
                        </Group>

                        <Textarea
                            value={body}
                            onChange={(e) => setBody(e.currentTarget.value)}
                            placeholder="Описание"
                            autosize
                            minRows={2}
                        />
                    </Stack>
                </form>
            )}

            <Stack>
                {plans.map((p) => (
                    <div key={p.id}>
                        <strong>{p.title}</strong>{' '}
                        — {p.scheduled_at ? new Date(p.scheduled_at).toLocaleString() : 'дата не указана'}
                        {p.body && <p>{p.body}</p>}
                    </div>
                ))}
            </Stack>
        </section>
    )
}
