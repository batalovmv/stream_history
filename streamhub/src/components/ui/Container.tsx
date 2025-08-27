import { PropsWithChildren } from 'react'
import { Container as MContainer } from '@mantine/core'
export default function Container({ children }: PropsWithChildren) {
  return <MContainer size={1100}>{children}</MContainer>
}
