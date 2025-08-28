import { Alert, Skeleton, Stack } from '@mantine/core'
import VideoGrid from '@/features/videos/components/VideoGrid'
import { useLatestVideos } from '@/features/videos/hooks/useVideos'
import AuthDebug from '@/features/auth/AuthDebug'


export default function FeedPage() {
  const { data, loading, error } = useLatestVideos(20)
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
  return <VideoGrid videos={data} />
}

