'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Document } from '@/lib/supabase/types'
import { TYPE_EMOJI } from '@/lib/constants/documents'

type Props = { document: Document }

export default function DocumentCard({ document: doc }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const emoji = TYPE_EMOJI[doc.type_detecte ?? 'autre'] ?? '📄'
  const date = new Date(doc.created_at).toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Supprimer ce document ?')) return
    setDeleting(true)
    await fetch(`/api/documents/${doc.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <Link href={`/documents/${doc.id}`} className="block">
      <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#F97316] hover:shadow-sm transition-all relative group">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Supprimer"
        >
          {deleting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>

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
