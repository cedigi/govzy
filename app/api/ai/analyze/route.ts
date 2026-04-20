// app/api/ai/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { geminiFlash, fileToGenerativePart, SYSTEM_PROMPT } from '@/lib/gemini'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'] as const
type AllowedMime = typeof ALLOWED_MIME_TYPES[number]

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })

  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMime)) {
    return NextResponse.json({ error: 'Format non supporté. Utilisez PDF, JPG ou PNG.' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo).' }, { status: 400 })
  }

  // Upload vers Supabase Storage
  const ext = file.name.split('.').pop() ?? 'bin'
  const storagePath = `${user.id}/${Date.now()}.${ext}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(storagePath, buffer, { contentType: file.type })

  if (uploadError) {
    console.error('[analyze] Storage upload error:', uploadError)
    return NextResponse.json({ error: "Erreur lors de l'upload du fichier." }, { status: 500 })
  }

  // Analyse Gemini
  const base64 = buffer.toString('base64')
  let type_detecte = 'Document'
  let resume = ''

  try {
    const result = await geminiFlash.generateContent([
      SYSTEM_PROMPT,
      `Analyse ce document administratif belge. Réponds UNIQUEMENT en JSON avec ce format exact :
{"type": "<type de document en français>", "resume": "<résumé en 2-3 phrases>"}
Types possibles : fiche_de_paie, contrat_de_travail, facture, composition_de_menage, avertissement_extrait_de_role, document_cpas, autre`,
      fileToGenerativePart(base64, file.type),
    ])
    const text = result.response.text()
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim())
    type_detecte = parsed.type ?? 'Document'
    resume = parsed.resume ?? ''
  } catch (err) {
    console.error('[analyze] Gemini error:', err)
    type_detecte = 'autre'
    resume = 'Analyse non disponible.'
  }

  // Sauvegarde en DB
  const { data: document, error: dbError } = await (supabase
    .from('documents') as unknown as {
      insert: (v: unknown) => { select: () => { single: () => Promise<{ data: import('@/lib/supabase/types').Document | null; error: unknown }> } }
    })
    .insert({ user_id: user.id, nom: file.name, type_detecte, resume, storage_path: storagePath })
    .select()
    .single()

  if (dbError) {
    console.error('[analyze] DB insert error:', dbError)
    return NextResponse.json({ error: 'Erreur base de données.' }, { status: 500 })
  }

  return NextResponse.json({ document })
}
