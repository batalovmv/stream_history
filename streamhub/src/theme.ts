import { createTheme, rem } from '@mantine/core'


export const theme = createTheme({
    fontFamily: 'Inter, system-ui, sans-serif',
    defaultRadius: 'md',
    primaryColor: 'indigo',
    components: {
        Button: { styles: () => ({ root: { fontWeight: 600, borderRadius: rem(24) } }) },
        Card: {
            styles: () => ({
                root: {
                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,.35)' }
                }
            })
        }
    }
})