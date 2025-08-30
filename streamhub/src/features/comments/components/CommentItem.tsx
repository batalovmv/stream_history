import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { Comment } from '@/types'
import { addReply, removeComment } from '../services/commentsService'
import Card from '@/components/ui/Card'
import { ActionIcon, Button, Group, Stack, Text, Textarea, Tooltip } from '@mantine/core'
import { IconCornerDownRight, IconTrash } from '@tabler/icons-react'

type Node = Comment & { children: Node[] }

export default function CommentItem({ node, videoId }: { node: Node; videoId: number }) {
    const user = useSelector((s: RootState) => s.auth.user)
    const isAdmin = useSelector((s: RootState) => s.auth.isAdmin)

    const [replyOpen, setReplyOpen] = useState(false)
    const [replyText, setReplyText] = useState('')

    const canDelete = !!user && (isAdmin || user.id === node.user_id)

    const onDelete = async () => {
        try { await removeComment(node.id) } catch { /* можно показать notifications */ }
    }

    const onReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyText.trim()) return
        try {
            await addReply({ videoId, parentId: node.id, body: replyText.trim() })
            setReplyText('')
            setReplyOpen(false)
        } catch { /* можно показать notifications */ }
    }

    return (
        <Card withBorder>
            <Stack gap={8}>
                <Group justify="space-between" align="center">
                    <Text size="xs" c="dimmed">
                        {node.profiles?.display_name || 'Гость'} • {new Date(node.created_at).toLocaleString()}
                    </Text>

                    {canDelete && (
                        <Tooltip label="Удалить">
                            <ActionIcon variant="light" color="red" onClick={onDelete}>
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Group>

                <Text>{node.body}</Text>

                {user && (
                    <ActionIcon
                        variant="subtle"
                        onClick={() => setReplyOpen(v => !v)}
                        aria-label={replyOpen ? 'Скрыть форму ответа' : 'Ответить'}
                    >
                        <IconCornerDownRight size={16} />
                    </ActionIcon>
                )}

                {replyOpen && (
                    <form onSubmit={onReply}>
                        <Stack gap={8}>
                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.currentTarget.value)}
                                autosize
                                minRows={2}
                                placeholder="Ответить..."
                            />
                            <Group justify="flex-end">
                                <Button type="submit">Ответить</Button>
                            </Group>
                        </Stack>
                    </form>
                )}

                {/* дети */}
                {node.children.length > 0 && (
                    <Stack mt="xs" ml="lg" gap="xs">
                        {node.children.map(child => (
                            <CommentItem key={child.id} node={child} videoId={videoId} />
                        ))}
                    </Stack>
                )}
            </Stack>
        </Card>
    )
}
