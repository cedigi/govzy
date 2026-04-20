import Link from 'next/link'
import type { Document } from '@/lib/supabase/types'

const typeEmoji: Record<string, string> = {
  fiche_de_paie: '💰',
  contrat_de_travail: '📋',
  facture: '🧾',
  composition_de_menage: '👨‍👩‍👧',
  avertissement_extrait_de_role: '🏛️',
  document_cpas: '🤝',
  autre: '📄',
}

type Props = { document: Document }

export default function DocumentCard({ document: doc }: Props) {
  const emoji = typeEmoji[doc.type_detecte ?? 'autre'] ?? '📄'
  const date = new Date(doc.created_at).toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link href={`/documents/${doc.id}`} className="block">
      <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#F97316] hover:shadow-sm transition-all">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1B3A6B]/10 flex items-center justify-center text-xl flex-shrink-0">
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{doc.nom}</p>
            <p className="text-xs text-[#F97316] font-medium mt-0.5 capitalize">
              {doc.type_detecte?.replace(/_/g, ' ') ?? 'Analyse en cours…'}
            </p>
            {doc.resume && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doc.resume}</p>
            )}
            <p className="text-xs text-slate-300 mt-2">{date}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
