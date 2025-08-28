import { Card as MCard, type CardProps } from '@mantine/core'
export default function Card(props: CardProps) { return <MCard radius="md" shadow="sm" withBorder {...props} /> }