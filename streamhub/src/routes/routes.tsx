import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import FeedPage from '@/pages/FeedPage'
import ArchivePage from '@/pages/ArchivePage'
import PlansPage from '@/pages/PlansPage'
import VideoPage from '@/pages/VideoPage'
import { Alert, Container, Title, Text } from '@mantine/core'
import VideoEditPage from '@/pages/VideoEditPage'
import GamePage from '@/pages/GamePage'
import NewVideoPage from '@/pages/admin/NewVideoPage'
import YoutubeImportPage from '@/pages/admin/YoutubeImportPage'
import UserPage from '@/pages/UserPage'
import ProfileSettingsPage from '@/pages/ProfileSettingsPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'

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

export const router = createBrowserRouter(
  [
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
        { path: 'game/:slug', element: <GamePage /> },
        { path: 'u/:handle', element: <UserPage /> },
        { path: 'settings/profile', element: <ProfileSettingsPage /> },
        { path: ':handle([a-z0-9._-]+)', element: <UserPage /> },
        { path: 'privacy', element: <PrivacyPage /> },
        { path: 'terms', element: <TermsPage /> },
        // Админ
        { path: 'admin/videos/new', element: <NewVideoPage /> },
        { path: 'admin/youtube-import', element: <YoutubeImportPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
)