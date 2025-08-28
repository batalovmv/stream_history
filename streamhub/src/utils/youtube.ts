export function getYouTubeId(url?: string | null) {
    if (!url) return null
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : null
}