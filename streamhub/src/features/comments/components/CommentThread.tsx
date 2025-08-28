import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabaseClient'
import { listComments, addComment } from '../services/commentsService'
import type { RootState } from '@/store'
import type { Comment } from '@/types'
import { Button, Stack, Text, Textarea, Group } from '@mantine/core'
import Card from '@/components/ui/Card'


export default function CommentThread({ videoId }: { videoId: number }) {
    const user = useSelector((s: RootState) => s.auth.user)
    const [comments, setComments] = useState<Comment[]>([])
    const [text, setText] = useState('')


    const load = async () => setComments(await listComments(videoId))


    useEffect(() => {
        load()
        const channel = supabase
            .channel('comments-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `video_id=eq.${videoId}` }, load)
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [videoId])


    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!text.trim() || !user) return
        await addComment({ videoId, userId: user.id, body: text })
        setText('')
    }


    return (
        <Stack gap="sm" mt="md">
            <Text fw={600}>Комментарии</Text>
            {user ? (
                <form onSubmit={submit}>
                    <Stack>
                        <Textarea value={text} onChange={(e) => setText(e.currentTarget.value)} placeholder="Написать комментарий..." autosize minRows={2} />
                        <Group justify="flex-end"><Button type="submit">Отправить</Button></Group>
                    </Stack>
                </form>
            ) : (<Text c="dimmed">Войдите, чтобы комментировать.</Text>)}
            <Stack>
                {comments.map(c => (
                    <Card key={c.id}>
                        <Stack gap={4}>
                            <Text size="xs" c="dimmed">{c.profiles?.display_name || 'Гость'} • {new Date(c.created_at).toLocaleString()}</Text>
                            <Text>{c.body}</Text>
                        </Stack>
                    </Card>
                ))}
            </Stack>
        </Stack>
    )
}