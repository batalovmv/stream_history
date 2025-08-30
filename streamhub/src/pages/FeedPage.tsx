import { useEffect, useState } from 'react'
import { Alert, Skeleton, Stack } from '@mantine/core'
import VideoGrid from '@/features/videos/components/VideoGrid'
import { useLatestVideos } from '@/features/videos/hooks/useVideos'
import AuthDebug from '@/features/auth/AuthDebug'
import type { Video } from '@/types'

export default function FeedPage() {
  const { data, loading, error } = useLatestVideos(20)
  const [items, setItems] = useState<Video[]>([])

  useEffect(() => { if (data) setItems(data) }, [data])

  if (loading) {
    return (
      <Stack>
        <AuthDebug />
        <Skeleton h={16} w={200} />
        <Skeleton h={200} />
        <Skeleton h={200} />
      </Stack>
    )
  }
  if (error) return <Alert color="red">Ошибка: {(error as Error).message}</Alert>

  const onChanged = (v: Video) =>
    setItems(prev => prev.map(x => x.id === v.id ? v : x))

  const onDeleted = (id: number) =>
    setItems(prev => prev.filter(x => x.id !== id))

  return <VideoGrid videos={items} onChanged={onChanged} onDeleted={onDeleted} />
}
