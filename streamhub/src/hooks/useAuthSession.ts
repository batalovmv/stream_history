import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { supabase } from '@/lib/supabaseClient'
import { setUser, clearUser, setIsAdmin, setReady, setProfile } from '@/store/slices/authSlice'

export function useAuthSession() {
  const dispatch = useDispatch()

  useEffect(() => {
    let mounted = true
    let didInit = false

    const sync = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!mounted) return
      if (session?.user) {
        dispatch(setUser(session.user))
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin, handle, display_name, avatar_url')
            .eq('id', session.user.id)
            .single()
          dispatch(setIsAdmin(!!profile?.is_admin))
          dispatch(setProfile({
            handle: profile?.handle ?? null,
            display_name: profile?.display_name ?? null,
            avatar_url: profile?.avatar_url ?? null,
          }))
        } catch {
          dispatch(setIsAdmin(false))
          dispatch(setProfile(null))
        }
      } else {
        dispatch(clearUser())
      }

      if (!didInit) { dispatch(setReady(true)); didInit = true }
    }

    // подписка на изменения сессии
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void sync() })

    // синхронизация при монтировании
    void sync()

    // синк между вкладками
    const key = ((): string | null => {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) ?? ''
        if (k.startsWith('sb-') && k.endsWith('-auth-token')) return k
      }
      return null
    })()
    const onStorage = (e: StorageEvent) => { if (e.key === key) void sync() }
    window.addEventListener('storage', onStorage)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('storage', onStorage)
      mounted = false
    }
  }, [dispatch])
}
