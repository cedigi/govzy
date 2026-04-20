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
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(10px)',
        borderRadius: '14px',
        padding: '16px',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.4)'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
      >
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-2 right-2 p-1.5 rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
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
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(249,115,22,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', flexShrink: 0,
          }}>
            {emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate" style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{doc.nom}</p>
            <p className="mt-0.5 capitalize" style={{ fontSize: '11px', color: '#f97316', fontWeight: 500 }}>
              {doc.type_detecte?.replace(/_/g, ' ') ?? 'Analyse en cours…'}
            </p>
            {doc.resume && (
              <p className="mt-1 line-clamp-2" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{doc.resume}</p>
            )}
            <p className="mt-2" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{date}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
