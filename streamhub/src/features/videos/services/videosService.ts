import { supabase } from '@/lib/supabaseClient'
import type { Video } from '@/types'

type FetchParams = {
  game_slug?: string
  limit?: number
}

/** Базовая выборка видео c опциональным фильтром по game_slug */
export async function fetchVideos(params?: FetchParams): Promise<Video[]> {
  let q = supabase
    .from('videos')
    .select(
      // Возвращаем поля видео + связку игры
      'id, title, youtube_url, description, published_at, created_at, author_id, tags, game_id, games:game_id(name, slug)'
    )
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  // фильтр по игре, если передан slug
  if (params?.game_slug) {
    const { data: g, error: gErr } = await supabase
      .from('games')
      .select('id')
      .eq('slug', params.game_slug)
      .single()
    if (gErr) throw gErr
    if (!g?.id) return []
    q = q.eq('game_id', g.id as number)
  }

  if (params?.limit) q = q.limit(params.limit)

  const { data, error } = await q
  if (error) throw error
  return (data as unknown as Video[]) ?? []
}

/** Совместимо с текущим кодом: listLatestVideos({ limit }) */
export async function listLatestVideos(params: { limit: number }): Promise<Video[]> {
  return fetchVideos({ limit: params.limit })
}

/** Нужен для ArchivePage.tsx — выбрать все видео (без лимита) */
export async function listAllVideos(): Promise<Video[]> {
  return fetchVideos()
}

/** (Опционально) выборка по игре */
export async function listVideosByGame(game_slug: string, limit?: number): Promise<Video[]> {
  return fetchVideos({ game_slug, limit })
}

/** Добавление новой записи видео в public.videos.
 * - youtubeUrl — полная ссылка (https://youtu.be/... или https://www.youtube.com/watch?v=...)
 * - game_slug — если указан, попробуем найти games.id и проставить game_id
 * - tags — сохраняем как массив строк (jsonb)
 */
export async function addVideo(input: {
  title: string
  youtubeUrl: string
  game_slug?: string | null
  description?: string | null
  published_at?: string | null
  tags?: string[]
}): Promise<Video> {
  const url = input.youtubeUrl.trim()

  // (опционально) можно вытащить youtube_id, если когда-то пригодится
  // const idMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  // const youtube_id = idMatch?.[1] // в БД не храним, просто пример

  // найти game_id по slug
  let game_id: number | null = null
  if (input.game_slug) {
    const { data: g } = await supabase.from('games').select('id').eq('slug', input.game_slug).single()
    if (g?.id) game_id = g.id as number
  }

  const payload: any = {
    title: input.title.trim(),
    youtube_url: url,
    description: input.description?.trim() ?? null,
    published_at: input.published_at ?? null,
    tags: input.tags ?? [],
    game_id,
  }

  const { data, error } = await supabase
    .from('videos')
    .insert(payload)
    .select(
      'id, title, youtube_url, description, published_at, created_at, author_id, tags, game_id, games:game_id(name, slug)'
    )
    .single()

  if (error) throw error
  return data as unknown as Video
}
