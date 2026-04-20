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
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#F97316]" />
          <h2 className="text-sm font-semibold text-[#1B3A6B]">Aides détectées</h2>
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
        <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
          <AlertCircle size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
          <p>
            Ajoutez au moins 3 documents pour une analyse automatique, ou cliquez sur{' '}
            <button onClick={analyser} className="text-[#F97316] font-medium hover:underline">
              Analyser mes aides
            </button>
            .
          </p>
        </div>
      )}

      {contenu?.type === 'manque_docs' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-600">{contenu.message}</p>
          <p className="text-xs font-medium text-slate-700 mt-1">Documents utiles :</p>
          <ul className="flex flex-col gap-1">
            {contenu.docs_requis.map((doc) => (
              <li key={doc} className="flex items-center gap-2 text-xs text-slate-500">
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
            <div key={aide.nom} className="border border-slate-100 rounded-lg p-3 hover:border-[#F97316]/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-[#1B3A6B]">{aide.nom}</p>
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
              <p className="text-xs text-slate-500 mt-1">{aide.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
