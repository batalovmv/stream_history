import { Container, Title, Text, List, Anchor, Space } from '@mantine/core'

export default function PrivacyPage() {
    return (
        <Container py="xl" size="md">
            <Title order={2} mb="sm">Privacy Policy</Title>
            <Text c="dimmed" size="sm">Last updated: {new Date().toISOString().slice(0, 10)}</Text>
            <Space h="md" />

            <Text>
                We collect your Google basic profile (email, profile) to create your account and link it to a Supabase profile.
                We also store your YouTube <b>channelId</b> and public video metadata (title, description, published date, URL)
                so you can display your own videos on your profile page.
            </Text>

            <Space h="md" />
            <Title order={4}>YouTube API usage</Title>
            <List mt="xs">
                <List.Item>
                    We use <code>youtube.readonly</code> only to:
                    <List withPadding mt={4}>
                        <List.Item>call <code>channels?mine=true</code> to confirm your channel ownership;</List.Item>
                        <List.Item>optionally call <code>videos?part=snippet&amp;id=...</code> to read public metadata when you import a video.</List.Item>
                    </List>
                </List.Item>
                <List.Item>We do not modify or delete any YouTube resources.</List.Item>
                <List.Item>We never share your data with third parties.</List.Item>
            </List>

            <Space h="md" />
            <Title order={4}>Data retention & deletion</Title>
            <List mt="xs">
                <List.Item>You can delete imported videos in the app.</List.Item>
                <List.Item>
                    To request full data deletion, contact us at <Anchor href="mailto:you@example.com">you@example.com</Anchor>.
                </List.Item>
                <List.Item>
                    You can revoke access anytime in Google Account settings:&nbsp;
                    <Anchor href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
                        myaccount.google.com/permissions
                    </Anchor>.
                </List.Item>
            </List>

            <Space h="md" />
            <Title order={4}>Contact</Title>
            <Text>
                If you have questions about this policy, email us at&nbsp;
                <Anchor href="mailto:you@example.com">you@example.com</Anchor>.
            </Text>
        </Container>
    )
}
