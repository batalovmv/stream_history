import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import FeedPage from '@/pages/FeedPage'
import ArchivePage from '@/pages/ArchivePage'
import PlansPage from '@/pages/PlansPage'
import VideoPage from '@/pages/VideoPage'
import { Alert, Container, Title, Text } from '@mantine/core'
import VideoEditPage from '@/pages/VideoEditPage'

function RouteError() {
  return (
    <Container py="xl">
      <Alert color="red" title="Упс!">
        <Title order={4} mb="xs">Страница не найдена</Title>
        <Text>Похоже, вы перешли по несуществующему маршруту.</Text>
      </Alert>
    </Container>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'archive', element: <ArchivePage /> },
      { path: 'plans', element: <PlansPage /> },
      { path: 'video/:id', element: <VideoPage /> },
      { path: 'video/:id/edit', element: <VideoEditPage /> },
    ],
  },
])
