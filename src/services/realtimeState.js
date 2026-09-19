import { isSupabaseConfigured, supabase } from './supabase'

const SESSION_ID = 'main'

export async function loadSharedState() {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('demo_sessions')
    .select('state, updated_by, updated_at')
    .eq('id', SESSION_ID)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function saveSharedState(state, clientId) {
  if (!isSupabaseConfigured) return

  const { error } = await supabase
    .from('demo_sessions')
    .upsert({
      id: SESSION_ID,
      state,
      updated_by: clientId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

  if (error) throw error
}

export function subscribeToSharedState({ onState, onStatus }) {
  if (!isSupabaseConfigured) return () => {}

  const channel = supabase
    .channel('pilot-demo-main')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'demo_sessions',
        filter: `id=eq.${SESSION_ID}`,
      },
      (payload) => onState(payload.new),
    )
    .subscribe((status) => onStatus(status))

  return () => {
    supabase.removeChannel(channel)
  }
}
