import { createClient } from '@/lib/supabase/server'
import AidesClient from './AidesClient'
import type { SuggestionContenu } from '@/lib/supabase/types'

const DOCS_ESSENTIELS = [
  { key: 'fiche_de_paie', label: 'Fiche de paie', subtitle: 'revenus connus', emoji: '💰' },
  { key: 'composition_de_menage', label: 'Composition de ménage', subtitle: 'situation familiale', emoji: '👨‍👩‍👧' },
  { key: 'avertissement_extrait_de_role', label: 'Extrait de rôle', subtitle: 'situation fiscale', emoji: '🏛️' },
  { key: 'attestation_mutuelle', label: 'Attestation mutuelle', subtitle: 'couverture santé', emoji: '🏥' },
]

export default async function AidesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: documents } = await supabase
    .from('documents')
    .select('type_detecte')
    .eq('user_id', user!.id) as { data: { type_detecte: string | null }[] | null; error: unknown }

  const typesPresents = new Set((documents ?? []).map(d => d.type_detecte?.toLowerCase()))

  const docsEssentiels = DOCS_ESSENTIELS.map(doc => ({
    ...doc,
    present: typesPresents.has(doc.key),
  }))

  const { data: lastSuggestion } = await supabase
    .from('suggestions')
    .select('contenu, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single() as { data: { contenu: SuggestionContenu; created_at: string } | null; error: unknown }

  return (
    <AidesClient
      docsEssentiels={docsEssentiels}
      initialContenu={lastSuggestion?.contenu ?? null}
      lastAnalysedAt={lastSuggestion?.created_at ?? null}
    />
  )
}
