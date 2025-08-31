import { useEffect, useState } from 'react'
import { Button, Group, Text, TextInput, Alert, Stack, Card as MCard } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { supabase } from '@/lib/supabaseClient'

type MyVideo = {
    id: string
    title: string
    description: string
    channelId: string
}

export default function YoutubeImportPage() {
    const [input, setInput] = useState('')               // ссылка/ID видео
    const [owned, setOwned] = useState<string[]>([])     // подтверждённые channel_id
    const [loading, setLoading] = useState(false)
    const [loadingList, setLoadingList] = useState(false)
    const [myVideos, setMyVideos] = useState<MyVideo[]>([])

    // загрузить список подтверждённых каналов
    useEffect(() => {
        (async () => {
            const { data, error } = await supabase.from('user_channels').select('channel_id')
            if (!error) setOwned((data as { channel_id: string }[] ?? []).map(r => r.channel_id))
        })()
    }, [])

    // ---- Утилиты ----
    const extractVideoId = (s: string): string | null => {
        const isId = /^[a-zA-Z0-9_-]{11}$/
        try {
            const u = new URL(s)
            const host = u.hostname.replace(/^www\./, '')
            if (host === 'youtu.be') {
                const id = u.pathname.slice(1)
                return isId.test(id) ? id : null
            }
            const v = u.searchParams.get('v')
            if (v && isId.test(v)) return v
            const m = u.pathname.match(/^\/(embed|shorts|v)\/([a-zA-Z0-9_-]{11})/)
            if (m) return m[2]
            return null
        } catch {
            return isId.test(s) ? s : null
        }
    }

    const getProviderToken = async (): Promise<string | null> => {
        const { data: { session } } = await supabase.auth.getSession()
        return (
            (session as any)?.provider_token ||
            (session as any)?.provider_token?.access_token ||
            null
        )
    }

    const fetchVideoMeta = async (videoId: string, accessToken?: string) => {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}`,
            accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
        )
        if (res.status === 403) {
            throw new Error('Нет доступа к YouTube API (403). Выйдите и войдите заново, разрешив доступ к YouTube.')
        }
        const json = await res.json()
        if (!json.items?.length) throw new Error('Видео не найдено')
        return json.items[0] as { snippet: { channelId: string; title: string; description: string } }
    }

    const ensureOwnedOrThrow = async (channelId: string) => {
        const { count, error } = await supabase
            .from('user_channels')
            .select('*', { head: true, count: 'exact' })
            .eq('channel_id', channelId)
        if (error) throw error
        if (!count) throw new Error('Можно импортировать только видео со своих каналов')
    }

    // ---- Действия ----
    const confirmMyChannel = async () => {
        const token = await getProviderToken()
        if (!token) {
            notifications.show({ color: 'red', message: 'Нет токена Google. Перелогиньтесь, разрешив доступ к YouTube.' })
            return
        }
        const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=id,snippet&mine=true', {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 403) {
            notifications.show({ color: 'red', message: 'Доступ к YouTube запрещён (403). Перелогиньтесь с правами YouTube.' })
            return
        }
        const { data: { session } } = await supabase.auth.getSession()
        const json = await res.json()
        const items: any[] = Array.isArray(json.items) ? json.items : []
        if (!items.length) {
            notifications.show({ color: 'yellow', message: 'Каналы не найдены в вашем аккаунте' })
            return
        }
        // rows укажем типом, чтобы не было implicit any
        const rows: { user_id: string; channel_id: string; title: string | null }[] = items.map((it: any) => ({
            user_id: session!.user.id,
            channel_id: it.id as string,
            title: it.snippet?.title ?? null,
        }))

        const { error } = await supabase.from('user_channels')
            .upsert(rows, { onConflict: 'user_id,channel_id' })

        if (!error) {
            setOwned(prev => Array.from(new Set([...prev, ...rows.map(r => r.channel_id)])))
            notifications.show({ color: 'green', message: 'Канал подтверждён' })
        }

    }

    // список последних видео моих каналов (удобно без ручного ввода ссылок)
    const loadMyLatestVideos = async () => {
        setLoadingList(true)
        try {
            const token = await getProviderToken()
            if (!token) throw new Error('Нет токена Google. Перелогиньтесь с правами YouTube.')
            // шаг 1: мои каналы
            const chRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true', {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (chRes.status === 403) throw new Error('Нет доступа к YouTube API (403).')
            const chJson = await chRes.json()
            const channels = (chJson.items ?? []) as any[]
            const uploadsIds = channels
                .map(c => c?.contentDetails?.relatedPlaylists?.uploads)
                .filter(Boolean) as string[]
            if (!uploadsIds.length) {
                setMyVideos([])
                notifications.show({ color: 'yellow', message: 'Не нашёл плейлист загрузок вашего канала' })
                return
            }
            // шаг 2: взять последние элементы из uploads плейлистов
            const videos: MyVideo[] = []
            for (const pid of uploadsIds) {
                const plRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${pid}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const plJson = await plRes.json()
                const items = (plJson.items ?? []) as any[]
                for (const it of items) {
                    const s = it.snippet
                    if (!s?.resourceId?.videoId) continue
                    videos.push({
                        id: s.resourceId.videoId,
                        title: s.title,
                        description: s.description ?? '',
                        channelId: s.channelId,
                    })
                }
            }
            // уникализируем по id
            const unique = Array.from(new Map(videos.map(v => [v.id, v])).values())
            setMyVideos(unique)
        } catch (e: any) {
            notifications.show({ color: 'red', message: e.message || 'Не удалось загрузить список видео' })
        } finally {
            setLoadingList(false)
        }
    }

    const importById = async (videoId: string) => {
        setLoading(true)
        try {
            const token = await getProviderToken()
            const meta = await fetchVideoMeta(videoId, token || undefined)
            const channelId = meta.snippet.channelId
            await ensureOwnedOrThrow(channelId)
            const title = meta.snippet.title
            const description = meta.snippet.description
            const youtube_url = `https://www.youtube.com/watch?v=${videoId}`
            const { error } = await supabase.from('videos').insert({
                title, description, youtube_url,
                // если добавил videos.channel_id в БД — раскомментируй:
                // channel_id: channelId,
            })
            if (error) throw error
            notifications.show({ color: 'green', message: 'Видео импортировано' })
        } catch (e: any) {
            notifications.show({ color: 'red', message: e.message || 'Ошибка импорта' })
        } finally {
            setLoading(false)
        }
    }

    // импорт по вводу ссылки/ID
    const onImport = async (e: React.FormEvent) => {
        e.preventDefault()
        const raw = input.trim()
        if (!raw) return
        const videoId = extractVideoId(raw)
        if (!videoId) {
            notifications.show({
                color: 'yellow',
                message: 'Вставьте ссылку на конкретное видео или 11-символьный ID.',
            })
            return
        }
        await importById(videoId)
        setInput('')
    }

    return (
        <section>
            <h2>Импорт видео с YouTube</h2>

            {owned.length === 0 ? (
                <Group mb="md">
                    <Button onClick={confirmMyChannel} variant="light">Подтвердить мой YouTube-канал</Button>
                    <Text c="dimmed">После подтверждения сможете импортировать видео только со своих каналов.</Text>
                </Group>
            ) : (
                <Alert color="green" mb="md" title="Канал подтверждён">
                    Ваш канал привязан. Теперь можете импортировать видео с этого канала.
                </Alert>
            )}


            <form onSubmit={onImport}>
                <Group align="flex-end" mb="lg">
                    <TextInput
                        label="Ссылка или ID видео"
                        value={input}
                        onChange={(e) => setInput(e.currentTarget.value)}
                        placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                        w={460}
                        disabled={owned.length === 0}
                    />
                    <Button type="submit" loading={loading} disabled={owned.length === 0}>
                        Импортировать
                    </Button>
                </Group>
            </form>

            <Stack>
                <Group justify="space-between">
                    <Text fw={600}>Мои последние видео</Text>
                    <Button variant="light" onClick={loadMyLatestVideos} loading={loadingList} disabled={owned.length === 0}>
                        Загрузить список
                    </Button>
                </Group>

                {myVideos.length === 0 && (
                    <Text c="dimmed">Список пуст. Нажмите «Загрузить список».</Text>
                )}

                {myVideos.map(v => (
                    <MCard key={v.id} withBorder padding="md" radius="md">
                        <Group justify="space-between" wrap="wrap">
                            <Stack gap={4}>
                                <Text fw={600}>{v.title}</Text>
                                <Text size="sm" c="dimmed">ID: {v.id}</Text>
                            </Stack>
                            <Button variant="light" onClick={() => importById(v.id)} loading={loading}>
                                Импортировать
                            </Button>
                        </Group>
                    </MCard>
                ))}
            </Stack>
        </section>
    )
}
