import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import FeedPage from '../pages/FeedPage'
import ArchivePage from '../pages/ArchivePage'
import PlansPage from '../pages/PlansPage'

import NewVideoPage from '@/pages/admin/NewVideoPage'
import YoutubeImportPage from '@/pages/admin/YoutubeImportPage'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'archive', element: <ArchivePage /> },
      { path: 'plans', element: <PlansPage /> },

      // Админ
      { path: 'admin/videos/new', element: <NewVideoPage /> },
      { path: 'admin/youtube-import', element: <YoutubeImportPage /> },
    ],
  },
])
