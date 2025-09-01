import { useEffect, useState } from 'react'
import {
  Button,
  Alert,
  Stack,
  Group,
  Text as MText,
  SegmentedControl,
  Paper,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { supabase } from '@/lib/supabaseClient'

type MyVideo = {
  id: string
  title: string
  description: string
  channelId: string
}

type Privacy = 'public' | 'unlisted' | 'private'

export default function YoutubeImportPage() {
  const userId = useSelector((s: RootState) => s.auth.user?.id)

  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [mode, setMode] = useState<'public' | 'all'>('public') // слева: открыть/все
  const [list, setList] = useState<MyVideo[]>([])              // "Загрузить список"

  const log = (line: string) =>
    setLogs(prev => [line, ...prev].slice(0, 200))

  const getProviderToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession()
    return (
      (session as any)?.provider_token?.access_token ||
      (session as any)?.provider_token ||
      null
    )
  }

  // проверяем, что канал привязан к текущему юзеру
  const ensureOwnedOrThrow = async (channelId: string) => {
    const { count, error } = await supabase
      .from('user_channels')
      .select('*', { head: true, count: 'exact' })
      .eq('channel_id', channelId)
      .eq('user_id', userId)
    if (error) throw error
    if (!count) throw new Error('Канал не привязан. Сначала привяжите YouTube-аккаунт (кнопка вверху сайта).')
  }

  // uploads-плейлисты моих каналов
  const fetchMyUploadPlaylistIds = async (token: string): Promise<string[]> => {
    const res = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!res.ok) {
      if (res.status === 403) throw new Error('Доступ к YouTube API запрещён (403). Переавторизуйтесь с разрешением на YouTube.')
      throw new Error('Не удалось получить список каналов (channels?mine=true)')
    }
    const j = await res.json()
    const uploads = (j.items ?? [])
      .map((c: any) => c?.contentDetails?.relatedPlaylists?.uploads)
      .filter(Boolean) as string[]
    return uploads
  }

  // собрать все видео из плейлиста (пагинация)
  const fetchVideosFromPlaylist = async (token: string, playlistId: string): Promise<MyVideo[]> => {
    let next: string | undefined
    const acc: MyVideo[] = []
    do {
      const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
      url.searchParams.set('part', 'snippet')
      url.searchParams.set('maxResults', '50')
      url.searchParams.set('playlistId', playlistId)
      if (next) url.searchParams.set('pageToken', next)
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Не удалось получить элементы плейлиста загрузок')
      const j = await res.json()
      const items = (j.items ?? []) as any[]
      for (const it of items) {
        const s = it.snippet
        const vid = s?.resourceId?.videoId
        if (!vid) continue
        acc.push({
          id: vid,
          title: s?.title ?? '',
          description: s?.description ?? '',
          channelId: s?.channelId ?? '',
        })
      }
      next = j.nextPageToken
    } while (next)
    return acc
  }

  // получить privacyStatus для пачки ID (до 50 за запрос)
  const fetchPrivacyMap = async (token: string, ids: string[]): Promise<Record<string, Privacy>> => {
    const map: Record<string, Privacy> = {}
    for (let i = 0; i < ids.length; i += 50) {
      const chunk = ids.slice(i, i + 50)
      const url = new URL('https://www.googleapis.com/youtube/v3/videos')
      url.searchParams.set('part', 'status')
      url.searchParams.set('id', chunk.join(','))
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Не удалось получить статус видео')
      const j = await res.json()
      for (const it of (j.items ?? [])) {
        const id = it?.id
        const status = it?.status?.privacyStatus as Privacy | undefined
        if (id && status) map[id] = status
      }
    }
    return map
  }

  // применить фильтр по privacy (mode)
  const filterByPrivacy = (videos: MyVideo[], privacy: Record<string, Privacy>) => {
    if (mode === 'public') {
      return videos.filter(v => privacy[v.id] === 'public')
    }
    // mode === 'all' -> public + unlisted (исключаем private)
    return videos.filter(v => {
      const p = privacy[v.id]
      return p === 'public' || p === 'unlisted'
    })
  }

  // helper: дедупликация по youtube_url внутри одной пачки
  const dedupePayload = (items: { youtube_url: string }[]) => {
    const seen = new Set<string>()
    return items.filter(it => {
      if (seen.has(it.youtube_url)) return false
      seen.add(it.youtube_url)
      return true
    })
  }

  // helper: получить Set уже импортированных ID по youtube_url (для "Загрузить список")
  const fetchExistingSetByIds = async (ids: string[]): Promise<Set<string>> => {
    if (ids.length === 0) return new Set()
    const urls = ids.map(id => `https://www.youtube.com/watch?v=${id}`)
    const { data, error } = await supabase
      .from('videos')
      .select('youtube_url')
      .in('youtube_url', urls)
    if (error) throw error
    const exist = new Set<string>()
    for (const row of (data ?? [])) {
      const url: string = (row as any).youtube_url
      try {
        const id = new URL(url).searchParams.get('v')
        if (id) exist.add(id)
      } catch { /* ignore bad urls */ }
    }
    return exist
  }

  // импорт ВСЕХ (с фильтром по privacy) — UPSERT c ignoreDuplicates
  const importAllFromMyChannels = async () => {
    try {
      if (!userId) throw new Error('Требуется вход')
      setLoading(true)
      setLogs([])
      const token = await getProviderToken()
      if (!token) throw new Error('Нет токена доступа YouTube. Выйдите/войдите, разрешив доступ к YouTube.')

      const uploadPids = await fetchMyUploadPlaylistIds(token)
      if (uploadPids.length === 0) {
        notifications.show({ color: 'yellow', message: 'Не найден плейлист загрузок вашего канала' })
        return
      }

      let sent = 0

      for (const pid of uploadPids) {
        log(`Читаю плейлист загрузок: ${pid}`)
        const vids = await fetchVideosFromPlaylist(token, pid)
        if (vids.length === 0) continue

        const chId = vids[0]?.channelId
        if (chId) await ensureOwnedOrThrow(chId)

        // privacy filter
        const ids = vids.map(v => v.id)
        const privacyMap = await fetchPrivacyMap(token, ids)
        const filtered = filterByPrivacy(vids, privacyMap)
        if (filtered.length === 0) {
          log('Под выбранный фильтр видео не найдено')
          continue
        }

        const payloadAll = filtered.map(v => ({
          title: v.title,
          description: v.description,
          youtube_url: `https://www.youtube.com/watch?v=${v.id}`,
          author_id: userId,
        }))

        // дедупликат внутри пачки
        const payload = dedupePayload(payloadAll)

        // UPSERT батчами; на уровне БД должен быть уникальный индекс по youtube_url
        const chunkSize = 100
        for (let i = 0; i < payload.length; i += chunkSize) {
          const batch = payload.slice(i, i + chunkSize)
          const { error } = await supabase
            .from('videos')
            .upsert(batch, {
              onConflict: 'youtube_url',
              ignoreDuplicates: true, // DO NOTHING при конфликте
            })
          if (error) throw error
          sent += batch.length
        }

        log(`Отправлено: +${payload.length}. Дубликаты пропущены.`)
      }

      notifications.show({ color: 'green', message: `Импорт завершён. Отправлено записей: ${sent}.` })
    } catch (e: any) {
      console.error(e)
      notifications.show({ color: 'red', message: e.message || 'Ошибка импорта' })
    } finally {
      setLoading(false)
    }
  }

  // Загрузить список (с учётом фильтра privacy), показываем ТОЛЬКО неимпортированные
  const loadList = async () => {
    try {
      if (!userId) throw new Error('Требуется вход')
      setLoading(true)
      setLogs([])
      const token = await getProviderToken()
      if (!token) throw new Error('Нет токена доступа YouTube.')

      const uploadPids = await fetchMyUploadPlaylistIds(token)
      if (uploadPids.length === 0) {
        notifications.show({ color: 'yellow', message: 'Не найден плейлист загрузок вашего канала' })
        return
      }

      const all: MyVideo[] = []
      for (const pid of uploadPids) {
        const vids = await fetchVideosFromPlaylist(token, pid)
        all.push(...vids)
      }
      if (all.length === 0) {
        setList([])
        notifications.show({ color: 'yellow', message: 'Видео не найдены' })
        return
      }

      const ids = all.map(v => v.id)
      const privacyMap = await fetchPrivacyMap(token, ids)
      const byPrivacy = filterByPrivacy(all, privacyMap)

      // исключаем уже импортированные
      const existing = await fetchExistingSetByIds(byPrivacy.map(v => v.id))
      const onlyNew = byPrivacy.filter(v => !existing.has(v.id))

      setList(onlyNew)
      log(`Список готов: ${onlyNew.length} новых видео`)
    } catch (e: any) {
      console.error(e)
      notifications.show({ color: 'red', message: e.message || 'Ошибка загрузки списка' })
    } finally {
      setLoading(false)
    }
  }

  // Импорт одного из списка
  const importOne = async (v: MyVideo) => {
    try {
      if (!userId) throw new Error('Требуется вход')
      setLoading(true)

      if (v.channelId) await ensureOwnedOrThrow(v.channelId)

      const row = {
        title: v.title,
        description: v.description,
        youtube_url: `https://www.youtube.com/watch?v=${v.id}`,
        author_id: userId,
      }

      const { error } = await supabase
        .from('videos')
        .upsert([row], {           // <= массив из 1 элемента
          onConflict: 'youtube_url',
          ignoreDuplicates: true,  // DO NOTHING при конфликте
        })
      if (error) throw error

      // сразу убираем из списка
      setList(prev => prev.filter(x => x.id !== v.id))

      notifications.show({ color: 'green', message: 'Видео импортировано (или уже было).' })
    } catch (e: any) {
      console.error(e)
      notifications.show({ color: 'red', message: e.message || 'Ошибка импорта' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <Stack>
        <Alert variant="light" color="gray">
          Импортируйте видео из вашего привязанного YouTube-канала. По умолчанию загружаются только <b>открытые</b> видео.
        </Alert>

        <Paper p="sm" withBorder>
          <Group justify="space-between" align="center" wrap="wrap">
            <SegmentedControl
              value={mode}
              onChange={(v) => setMode(v as 'public' | 'all')}
              data={[
                { label: 'Загрузить открытые видео', value: 'public' },
                { label: 'Загрузить все видео канала', value: 'all' },
              ]}
            />
            <Group>
              <Button onClick={loadList} variant="default" loading={loading}>
                Загрузить список
              </Button>
              <Button onClick={importAllFromMyChannels} loading={loading}>
                Импортировать
              </Button>
            </Group>
          </Group>
        </Paper>

        {/* Список для предварительного просмотра/точечного импорта — только НЕимпортированные */}
        {list.length > 0 && (
          <Stack>
            <MText fw={600}>Найдено новых видео: {list.length}</MText>
            <Stack gap="xs">
              {list.map((v) => (
                <Group key={v.id} justify="space-between" wrap="wrap">
                  <Stack gap={2} style={{ minWidth: 260 }}>
                    <MText fw={500}>{v.title}</MText>
                    <MText size="xs" c="dimmed">ID: {v.id}</MText>
                  </Stack>
                  <Button size="xs" variant="light" onClick={() => importOne(v)} loading={loading}>
                    Импортировать
                  </Button>
                </Group>
              ))}
            </Stack>
          </Stack>
        )}

        {logs.length > 0 && (
          <Stack gap={4}>
            <MText fw={600}>Лог:</MText>
            {logs.map((l, i) => <MText key={i} c="dimmed" size="sm">• {l}</MText>)}
          </Stack>
        )}
      </Stack>
    </section>
  )
}
