import { SimpleGrid } from '@mantine/core'
import VideoCard from './VideoCard'
import type { Video } from '@/types'

export default function VideoGrid({
    videos,
    onChanged,
    onDeleted,
}: {
    videos: Video[]
    onChanged?: (v: Video) => void
    onDeleted?: (id: number) => void
}) {
    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            spacing={{ base: 'md', sm: 'lg', lg: 24 }}
            verticalSpacing={{ base: 'md', sm: 'lg', lg: 24 }}
        >
            {videos.map((v) => (
                <VideoCard key={v.id} video={v} onChanged={onChanged} onDeleted={onDeleted} />
            ))}
        </SimpleGrid>
    )
}
