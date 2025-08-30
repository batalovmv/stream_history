export function getYouTubeId(url?: string | null) {
    if (!url) return null
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : null
}
export function extractYoutubeId(url: string): string | null {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
    return m ? m[1] : null
}

export function youtubeThumb(url: string): { primary: string; fallback: string } {
    const id = extractYoutubeId(url)
    if (!id) {
        // пустые заглушки (можешь заменить своим плейсхолдером)
        return {
            primary: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" fill="%23aaa" font-size="24" text-anchor="middle" dominant-baseline="middle">No preview</text></svg>',
            fallback: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="%23222"/></svg>'
        }
    }
    // maxresdefault.webp → если нет,fallback на hqdefault.jpg
    return {
        primary: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        fallback: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    }
}