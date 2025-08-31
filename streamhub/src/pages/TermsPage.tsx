import { Container, Title, Text, List, Space } from '@mantine/core'

export default function TermsPage() {
    return (
        <Container py="xl" size="md">
            <Title order={2} mb="sm">Terms of Service</Title>
            <Text c="dimmed" size="sm">Last updated: {new Date().toISOString().slice(0, 10)}</Text>
            <Space h="md" />

            <Title order={4}>Use of Service</Title>
            <List mt="xs">
                <List.Item>You agree to import videos only from YouTube channels you own.</List.Item>
                <List.Item>You are responsible for content you upload or import.</List.Item>
                <List.Item>The service is provided “as is”, without warranties.</List.Item>
                <List.Item>We may remove content that violates these terms or applicable law.</List.Item>
            </List>

            <Space h="md" />
            <Title order={4}>Accounts & Privacy</Title>
            <Text mt="xs">
                We authenticate via Google and process data as described in our Privacy Policy.
            </Text>

            <Space h="md" />
            <Title order={4}>Contact</Title>
            <Text>If you have questions about these terms, contact us at you@example.com.</Text>
        </Container>
    )
}
