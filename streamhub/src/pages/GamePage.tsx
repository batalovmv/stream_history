import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Title } from '@mantine/core'
import VideoGrid from '@/features/videos/components/VideoGrid'

import type { Video } from '@/types'
import { listVideosByGameSlug } from '@/features/videos/services/videosService'


export default function GamePage() {
    const { slug } = useParams()
    const [game, setGame] = useState<{ id: number; name: string; slug: string } | null>(null)
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        (async () => {
            setLoading(true)
            const { game: g, videos: v } = await listVideosByGameSlug(slug as string)
            setGame(g); setVideos(v); setLoading(false)
        })()
    }, [slug])


    if (loading) return <p>Загрузка...</p>
    if (!game) return <p>Игра не найдена</p>
    return (
        <div>
            <Title order={2} mb="sm">Все записи по игре: {game.name}</Title>
            <VideoGrid videos={videos} />
        </div>
    )
}

