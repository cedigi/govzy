'use client'
import { useState } from 'react'
import { Sparkles, ExternalLink, AlertCircle, Loader2 } from 'lucide-react'
import type { SuggestionContenu } from '@/lib/supabase/types'

type Props = {
  docCount: number
  initialContenu?: SuggestionContenu | null
}

export default function SuggestionsPanel({ docCount, initialContenu }: Props) {
  const [contenu, setContenu] = useState<SuggestionContenu | null>(initialContenu ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyser() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/suggestions', { method: 'POST' })
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const data = await res.json() as { contenu: SuggestionContenu }
      setContenu(data.contenu)
    } catch (err) {
      setError('Erreur lors de l\'analyse. Réessayez.')
      console.error('[suggestions]', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl p-5" style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.09)',
      backdropFilter: 'blur(10px)',
    }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#F97316]" />
          <h2 className="text-sm font-semibold" style={{ color: 'white' }}>Aides détectées</h2>
        </div>
        <button
          onClick={analyser}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-[#F97316] font-medium hover:underline disabled:opacity-60"
        >
          {loading && <Loader2 size={12} className="animate-spin" />}
          {loading ? 'Analyse…' : 'Analyser mes aides'}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-600 bg-red-50 p-2 rounded-lg mb-3">{error}</p>
      )}

      {!contenu && docCount < 3 && (
        <div className="flex items-start gap-2 text-xs rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
          <AlertCircle size={14} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: '2px' }} />
          <p>
            Ajoutez au moins 3 documents pour une analyse automatique, ou cliquez sur{' '}
            <button onClick={analyser} style={{ color: '#f97316', fontWeight: 500 }}>
              Analyser mes aides
            </button>
            .
          </p>
        </div>
      )}

      {contenu?.type === 'manque_docs' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{contenu.message}</p>
          <p className="text-xs font-medium mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>Documents utiles :</p>
          <ul className="flex flex-col gap-1">
            {contenu.docs_requis.map((doc) => (
              <li key={doc} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {contenu?.type === 'aides' && (
        <div className="flex flex-col gap-3">
          {contenu.liste.map((aide) => (
            <div key={aide.nom} className="rounded-lg p-3" style={{
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold" style={{ color: 'white' }}>{aide.nom}</p>
                {aide.lien && (
                  <a
                    href={aide.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`En savoir plus sur ${aide.nom}`}
                    className="text-[#F97316] flex-shrink-0 hover:text-orange-600"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{aide.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
