import { useEffect, useMemo, useState } from 'react'
import { TextInput } from '@mantine/core'
import VideoGrid from '@/features/videos/components/VideoGrid'
import { listAllVideos } from '@/features/videos/services/videosService'
import type { Video } from '@/types'

export default function ArchivePage() {
    const [videos, setVideos] = useState<Video[]>([])
    const [query, setQuery] = useState('')

    useEffect(() => { (async () => setVideos(await listAllVideos()))() }, [])

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return videos.filter(v =>
            v.title.toLowerCase().includes(q) ||
            (v.description || '').toLowerCase().includes(q) ||
            (v.games?.name || '').toLowerCase().includes(q)
        )
    }, [videos, query])

    const onChanged = (v: Video) =>
        setVideos(prev => prev.map(x => x.id === v.id ? v : x))

    const onDeleted = (id: number) =>
        setVideos(prev => prev.filter(x => x.id !== id))

    return (
        <div>
            <TextInput
                placeholder="Поиск..."
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                mb="md"
            />
            <VideoGrid videos={filtered} onChanged={onChanged} onDeleted={onDeleted} />
        </div>
    )
}
