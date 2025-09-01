import { Group, Select, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

type Props = {
    query: string
    onQuery: (v: string) => void
    sort: 'new' | 'old'
    onSort: (v: 'new' | 'old') => void
    rightSlot?: React.ReactNode
}

export default function VideoToolbar({ query, onQuery, sort, onSort, rightSlot }: Props) {
    return (
        <Group justify="space-between" mb="md" wrap="wrap">
            <Group gap="sm" wrap="wrap">
                <TextInput
                    placeholder="Поиск по названию/описанию…"
                    leftSection={<IconSearch size={16} />}
                    value={query}
                    onChange={(e) => onQuery(e.currentTarget.value)}
                    w={260}
                />
                <Select
                    data={[
                        { value: 'new', label: 'Сначала новые' },
                        { value: 'old', label: 'Сначала старые' },
                    ]}
                    value={sort}
                    onChange={(v) => onSort((v as 'new' | 'old') ?? 'new')}
                    w={180}
                />
            </Group>
            {rightSlot}
        </Group>
    )
}
