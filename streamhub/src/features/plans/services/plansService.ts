import { supabase } from '@/lib/supabaseClient'
import type { Plan } from '@/types'


export async function listPlans(): Promise<Plan[]> {
    const { data, error } = await supabase.from('plans').select('*').order('scheduled_at', { ascending: true })
    if (error) throw error
    return (data as unknown as Plan[]) || []
}


export async function createPlan({ title, body, scheduled_at }: { title: string; body?: string; scheduled_at?: string }) {
    const { error } = await supabase.from('plans').insert({ title, body, scheduled_at })
    if (error) throw error
}