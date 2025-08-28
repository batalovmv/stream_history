import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { supabase } from '@/lib/supabaseClient'
import { setUser, clearUser, setIsAdmin, setReady } from '@/store/slices/authSlice'

function findAuthStorageKey() {
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i) ?? ''
    if (k.startsWith('sb-') && k.endsWith('-auth-token')) return k
  }
  return null
}

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
            .select('is_admin')
            .eq('id', session.user.id)
            .single()
          dispatch(setIsAdmin(!!(profile as any)?.is_admin))
        } catch {
          dispatch(setIsAdmin(false))
        }
      } else {
        dispatch(clearUser())
      }

      // помечаем «готов» ОДИН РАЗ после первой синхронизации
      if (!didInit) { dispatch(setReady(true)); didInit = true }
    }

    // 1) подписка на события Supabase
    const { data: sub } = supabase.auth.onAuthStateChange(() => { void sync() })

    // 2) первая синхронизация
    void sync()

    // 3) синк между вкладками
    const key = findAuthStorageKey()
    const onStorage = (e: StorageEvent) => { if (e.key === key) void sync() }
    window.addEventListener('storage', onStorage)

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
      window.removeEventListener('storage', onStorage)
    }
  }, [dispatch])
}
