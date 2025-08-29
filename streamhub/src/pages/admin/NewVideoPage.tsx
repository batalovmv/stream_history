import { Title } from '@mantine/core'
import VideoForm from '@/features/videos/components/VideoForm'

export default function NewVideoPage() {
  return (
    <section>
      <Title order={2} mb="md">Добавить запись стрима</Title>
      <VideoForm />
    </section>
  )
}
