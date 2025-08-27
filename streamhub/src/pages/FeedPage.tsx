import { Alert, Skeleton, Stack, SimpleGrid, Card, AspectRatio, Text } from '@mantine/core'
export default function FeedPage() {
  const loading = false, error = null
  const demo = Array.from({ length: 6 }).map((_,i)=>i)
  if (loading) return <Stack><Skeleton h={16} w={200}/><Skeleton h={200}/></Stack>
  if (error) return <Alert color="red">Ошибка загрузки</Alert>
  return (
    <SimpleGrid cols={{ base:1, sm:2, lg:3 }} spacing="md">
      {demo.map(i=>(
        <Card key={i} withBorder shadow="sm">
          <AspectRatio ratio={16/9} mb="xs">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="demo" allowFullScreen style={{border:0}}/>
          </AspectRatio>
          <Text fw={600}>Заголовок видео {i+1}</Text>
          <Text c="dimmed" size="sm">Описание видео…</Text>
        </Card>
      ))}
    </SimpleGrid>
  )
}
