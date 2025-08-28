import { useEffect, useState } from 'react'
import { listLatestVideos } from '../services/videosService'
import type { Video } from '@/types'


export function useLatestVideos(limit = 20) {
    const [data, setData] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    useEffect(() => { (async () => { try { setLoading(true); setData(await listLatestVideos({ limit })) } catch (e: any) { setError(e) } finally { setLoading(false) } })() }, [limit])
    return { data, loading, error }
}