import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ChatInterface from '@/components/documents/ChatInterface'
import type { Document, Message } from '@/lib/supabase/types'

const typeEmoji: Record<string, string> = {
  fiche_de_paie: '💰',
  contrat_de_travail: '📋',
  facture: '🧾',
  composition_de_menage: '👨‍👩‍👧',
  avertissement_extrait_de_role: '🏛️',
  document_cpas: '🤝',
  autre: '📄',
}

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [docResult, messagesResult] = await Promise.all([
    supabase
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user!.id)
      .single() as unknown as Promise<{ data: Document | null; error: unknown }>,
    supabase
      .from('messages')
      .select('id, role, content')
      .eq('document_id', params.id)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: true }) as unknown as Promise<{ data: Pick<Message, 'id' | 'role' | 'content'>[] | null; error: unknown }>,
  ])

  const doc = docResult.data
  const messages = messagesResult.data

  if (!doc) notFound()

  const emoji = typeEmoji[doc.type_detecte ?? 'autre'] ?? '📄'
  const date = new Date(doc.created_at).toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/documents" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h1 className="text-lg font-bold text-[#1B3A6B]">{doc.nom}</h1>
            <p className="text-xs text-[#F97316] font-medium capitalize">
              {doc.type_detecte?.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Summary card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-[#1B3A6B] mb-3">Résumé</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {doc.resume ?? 'Analyse en cours…'}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">Ajouté le {date}</p>
          </div>
        </div>

        {/* Chat */}
        <ChatInterface documentId={doc.id} messages={messages ?? []} />
      </div>
    </div>
  )
}
