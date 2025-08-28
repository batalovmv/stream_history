import type { PropsWithChildren } from 'react'
import { Container as MContainer, type ContainerProps } from '@mantine/core'
export default function Container({ children, size, ...rest }: ContainerProps) {
  return (
    <MContainer size={size ?? 1100} {...rest}>
      {children}
    </MContainer>
  )
}