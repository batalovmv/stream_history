import { Outlet } from 'react-router-dom'
import { Container, Paper } from '@mantine/core'
import Header from '@/components/layout/Header'

export default function MainLayout() {
  return (
    <>
      <Paper shadow="xs" p="md" withBorder>
        <Container size={1100}><Header /></Container>
      </Paper>
      <Container size={1100} pt="md">
        <Outlet />
      </Container>
    </>
  )
}