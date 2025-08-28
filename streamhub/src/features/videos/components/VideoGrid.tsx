import { SimpleGrid } from '@mantine/core'
import type { Video } from '@/types'
import VideoCard from './VideoCard'


export default function VideoGrid({ videos }: { videos: Video[] }) {
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </SimpleGrid>
    )
}