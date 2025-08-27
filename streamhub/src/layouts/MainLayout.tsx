import { Outlet } from 'react-router-dom'
import Container from '@/components/ui/Container'
import Header from '@/components/layout/Header'


export default function MainLayout() {
  return (
    <Container>
      <Header />
      <main className="container"><Outlet /></main>
    </Container>
  )
}
