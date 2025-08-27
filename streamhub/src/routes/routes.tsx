import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import FeedPage from '@/pages/FeedPage'
import ArchivePage from '@/pages/ArchivePage'
import GamePage from '@/pages/GamePage'
import PlansPage from '@/pages/PlansPage'
export const router = createBrowserRouter([{
  path: '/', element: <MainLayout />, children: [
    { index: true, element: <FeedPage /> },
    { path: 'archive', element: <ArchivePage /> },
    { path: 'games/:slug', element: <GamePage /> },
    { path: 'plans', element: <PlansPage /> },
  ]
}])
