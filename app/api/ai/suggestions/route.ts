import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { geminiFlash, SYSTEM_PROMPT } from '@/lib/gemini'
import type { SuggestionContenu } from '@/lib/supabase/types'

const DOCS_REQUIS_PAR_DEFAUT = [
  'fiche de paie',
  'composition de ménage',
  'avertissement extrait de rôle (impôts)',
  'attestation de chômage ou revenus',
]

async function saveSuggestion(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  contenu: SuggestionContenu,
  statut: 'detectee' | 'en_attente_docs'
) {
  await (supabase.from('suggestions') as unknown as { insert: (v: unknown) => Promise<unknown> }).insert({ user_id: userId, contenu, statut })
}

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: documents } = await supabase
    .from('documents')
    .select('nom, type_detecte, resume')
    .eq('user_id', user.id)
    .not('resume', 'is', null) as { data: { nom: string; type_detecte: string | null; resume: string }[] | null; error: unknown }

  if (!documents?.length) {
    const contenu: SuggestionContenu = {
      type: 'manque_docs',
      docs_requis: DOCS_REQUIS_PAR_DEFAUT,
      message: "Je n'ai pas encore de documents pour analyser vos droits.",
    }
    await saveSuggestion(supabase, user.id, contenu, 'en_attente_docs')
    return NextResponse.json({ contenu })
  }

  const docsContext = documents
    .map((d) => `- ${d.nom} (${d.type_detecte ?? 'type inconnu'}) : ${d.resume}`)
    .join('\n')

  const prompt = `${SYSTEM_PROMPT}

Voici les documents d'un utilisateur belge :
${docsContext}

Analyse ces documents et détermine si l'utilisateur peut bénéficier d'aides belges.

Réponds UNIQUEMENT en JSON sans markdown :

Si tu as des aides à proposer :
{"type":"aides","liste":[{"nom":"<nom>","description":"<pourquoi>","lien":"<url ou omets>"}]}

Si tu n'as pas assez d'informations :
{"type":"manque_docs","docs_requis":["<doc 1>","<doc 2>"],"message":"<explication>"}`

  let contenu: SuggestionContenu
  try {
    const result = await geminiFlash.generateContent(prompt)
    const text = result.response.text()
    contenu = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim()) as SuggestionContenu
  } catch (err) {
    console.error('[suggestions] Gemini error:', err)
    contenu = {
      type: 'manque_docs',
      docs_requis: DOCS_REQUIS_PAR_DEFAUT,
      message: "Erreur lors de l'analyse. Réessayez dans un instant.",
    }
  }

  const statut = contenu.type === 'aides' ? 'detectee' : 'en_attente_docs'
  await saveSuggestion(supabase, user.id, contenu, statut)

  return NextResponse.json({ contenu })
}
