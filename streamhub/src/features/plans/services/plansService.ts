import { supabase } from '@/lib/supabaseClient'

export type Plan = {
    id: number
    title: string
    body: string | null
    scheduled_at: string | null // ISO string (timestamptz)
    created_at: string
    author_id: string | null
}

export async function fetchPlans(limit = 50): Promise<Plan[]> {
    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('scheduled_at', { ascending: true })
        .limit(limit)
    if (error) throw error
    return data as Plan[]
}

export async function addPlan(input: {
    title: string
    body?: string | null
    scheduled_at?: string | null // ISO
}): Promise<Plan> {
    const { data, error } = await supabase
        .from('plans')
        .insert(input)
        .select('*')
        .single()
    if (error) throw error
    return data as Plan
}

export async function updatePlan(
    id: number,
    patch: Partial<Pick<Plan, 'title' | 'body' | 'scheduled_at'>>
): Promise<Plan> {
    const { data, error } = await supabase
        .from('plans')
        .update(patch)
        .eq('id', id)
        .select('*')
        .single()
    if (error) throw error
    return data as Plan
}

export async function deletePlan(id: number): Promise<void> {
    const { error } = await supabase.from('plans').delete().eq('id', id)
    if (error) throw error
}
