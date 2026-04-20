import { createClient } from '@/lib/supabase/server'
import AidesClient from './AidesClient'
import type { SuggestionContenu } from '@/lib/supabase/types'

export default async function AidesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { count: docCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const { data: lastSuggestion } = await supabase
    .from('suggestions')
    .select('contenu, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single() as { data: { contenu: SuggestionContenu; created_at: string } | null; error: unknown }

  return (
    <AidesClient
      docCount={docCount ?? 0}
      initialContenu={lastSuggestion?.contenu ?? null}
      lastAnalysedAt={lastSuggestion?.created_at ?? null}
    />
  )
}
