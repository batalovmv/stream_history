import { useEffect, useState } from 'react'
import { Button, Tooltip } from '@mantine/core'
import { IconHeart } from '@tabler/icons-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { getLikeCount, isLiked, like, unlike } from '@/features/videos/services/likesService'

export default function LikeButton({ videoId }: { videoId: number }) {
  const user = useSelector((s: RootState) => s.auth.user)
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    getLikeCount(videoId).then(setCount)
    if (user) isLiked(videoId, user.id).then(setLiked)
  }, [videoId, user?.id])

  const toggle = async () => {
    if (!user) return
    setLiked(v => !v)
    setCount(c => c + (liked ? -1 : 1))
    try {
      liked ? await unlike(videoId, user.id) : await like(videoId, user.id)
    } catch {
      // откат на ошибке
      setLiked(v => !v)
      setCount(c => c + (liked ? 1 : -1))
    }
  }

  if (!user) {
    return (
      <Tooltip label="Войдите, чтобы лайкать">
        <Button variant="light" leftSection={<IconHeart size={16} />} disabled>
          {count}
        </Button>
      </Tooltip>
    )
  }

  return (
    <Button
      variant={liked ? 'filled' : 'light'}
      onClick={toggle}
      leftSection={<IconHeart size={16} />}
    >
      {count}
    </Button>
  )
}
