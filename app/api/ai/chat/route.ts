// app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { geminiFlash, SYSTEM_PROMPT } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json() as { message?: string; document_id?: string }
  const { message, document_id } = body

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message manquant' }, { status: 400 })
  }

  // Contexte document si fourni
  let documentContext = ''
  if (document_id) {
    const { data: doc } = await supabase
      .from('documents')
      .select('nom, type_detecte, resume')
      .eq('id', document_id)
      .eq('user_id', user.id)
      .single()
    if (doc) {
      documentContext = `\nContexte du document "${doc.nom}" (${doc.type_detecte}) :\n${doc.resume}\n`
    }
  }

  // Historique récent (10 derniers messages)
  const historyQuery = supabase
    .from('messages')
    .select('role, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: history } = document_id
    ? await historyQuery.eq('document_id', document_id)
    : await historyQuery.is('document_id', null)

  const historyText = (history ?? [])
    .reverse()
    .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const prompt = [
    SYSTEM_PROMPT,
    documentContext,
    historyText ? `Historique de la conversation:\n${historyText}` : '',
    `Utilisateur: ${message}`,
    'Assistant:',
  ].filter(Boolean).join('\n\n')

  let reply = ''
  try {
    const result = await geminiFlash.generateContent(prompt)
    reply = result.response.text()
  } catch (err) {
    console.error('[chat] Gemini error:', err)
    reply = 'Désolé, je rencontre une difficulté technique. Réessayez dans un instant.'
  }

  // Sauvegarder les deux messages
  await supabase.from('messages').insert([
    { user_id: user.id, document_id: document_id ?? null, role: 'user' as const, content: message },
    { user_id: user.id, document_id: document_id ?? null, role: 'assistant' as const, content: reply },
  ])

  return NextResponse.json({ reply })
}
