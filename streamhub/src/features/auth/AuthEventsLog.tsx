
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthEventsLog() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log('getSession:', data.session ? 'HAS SESSION' : 'NO SESSION', data)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[onAuthStateChange]', event, session)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])
  return null
}
