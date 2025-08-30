import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabaseClient'
import { listComments, addComment } from '../services/commentsService'
import type { RootState } from '@/store'
import type { Comment } from '@/types'
import { Button, Stack, Text, Textarea } from '@mantine/core'
import Card from '@/components/ui/Card'
import CommentItem from './CommentItem'

type Node = Comment & { children: Node[] }

function buildTree(items: Comment[]): Node[] {
    const map = new Map<number, Node>()
    const roots: Node[] = []

    // подготовим узлы
    items.forEach(c => {
        map.set(c.id, { ...(c as any), children: [] })
    })

    // распределим по parent_id
    items.forEach(c => {
        const node = map.get(c.id)!
        if (c.parent_id) {
            const parent = map.get(c.parent_id)
            if (parent) parent.children.push(node)
            else roots.push(node) // на случай "осиротевших" ответов
        } else {
            roots.push(node)
        }
    })

    // опционально отсортируем детей по дате
    const sortByDate = (a: Node, b: Node) => a.created_at.localeCompare(b.created_at)
    const dfsSort = (n: Node) => { n.children.sort(sortByDate); n.children.forEach(dfsSort) }
    roots.sort(sortByDate)
    roots.forEach(dfsSort)

    return roots
}

export default function CommentThread({ videoId }: { videoId: number }) {
    const user = useSelector((s: RootState) => s.auth.user)
    const [comments, setComments] = useState<Comment[]>([])
    const [rootText, setRootText] = useState('')

    const load = async () => setComments(await listComments(videoId))

    useEffect(() => {
        void load()
        const channel = supabase
            .channel(`comments-realtime-${videoId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `video_id=eq.${videoId}` }, load)
            .subscribe()
        return () => { supabase.removeChannel(channel) }
    }, [videoId])

    const submitRoot = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!rootText.trim() || !user) return
        await addComment({ videoId, body: rootText.trim() })
        setRootText('')
        // reload не обязателен — сработает realtime; оставим на всякий случай «мгновенный» UX
        // void load()
    }

    const tree = useMemo(() => buildTree(comments), [comments])

    return (
        <Stack gap="sm" mt="md">
            <Text fw={600}>Комментарии</Text>

            {user ? (
                <Card>
                    <form onSubmit={submitRoot}>
                        <Stack>
                            <Textarea
                                value={rootText}
                                onChange={(e) => setRootText(e.currentTarget.value)}
                                placeholder="Написать комментарий..."
                                autosize
                                minRows={2}
                            />
                            <Stack align="flex-end">
                                <Button type="submit">Отправить</Button>
                            </Stack>
                        </Stack>
                    </form>
                </Card>
            ) : (
                <Text c="dimmed">Войдите, чтобы комментировать.</Text>
            )}

            <Stack>
                {tree.length === 0 ? (
                    <Text c="dimmed">Пока нет комментариев — будьте первым!</Text>
                ) : (
                    tree.map(node => (
                        <CommentItem key={node.id} node={node} videoId={videoId} />
                    ))
                )}
            </Stack>
        </Stack>
    )
}
