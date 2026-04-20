'use client'
import { useState } from 'react'
import { Sparkles, ExternalLink, AlertCircle, Loader2, FileText } from 'lucide-react'
import type { SuggestionContenu } from '@/lib/supabase/types'

type Props = {
  docCount: number
  initialContenu: SuggestionContenu | null
  lastAnalysedAt: string | null
}

export default function AidesClient({ docCount, initialContenu, lastAnalysedAt }: Props) {
  const [contenu, setContenu] = useState<SuggestionContenu | null>(initialContenu)
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
      console.error('[aides]', err)
    } finally {
      setLoading(false)
    }
  }

  const lastDate = lastAnalysedAt
    ? new Date(lastAnalysedAt).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'white' }}>Aides disponibles</h1>
          {lastDate && (
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Dernière analyse : {lastDate}
            </p>
          )}
        </div>
        <button
          onClick={analyser}
          disabled={loading}
          className="btn-shimmer disabled:opacity-60"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? 'Analyse en cours…' : 'Analyser mes aides'}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </p>
      )}

      {/* Pas encore de documents */}
      {!contenu && docCount === 0 && (
        <div className="rounded-xl p-12 flex flex-col items-center gap-3 text-center" style={{
          border: '2px dashed rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)',
        }}>
          <span className="text-4xl">📂</span>
          <p className="text-sm font-semibold" style={{ color: 'white' }}>Aucun document analysé</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Uploadez vos documents administratifs pour détecter vos aides
          </p>
        </div>
      )}

      {/* Pas encore d'analyse */}
      {!contenu && docCount > 0 && (
        <div className="rounded-xl p-10 flex flex-col items-center gap-4 text-center" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(249,115,22,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={24} style={{ color: '#f97316' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'white' }}>Découvrez vos aides</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Cliquez sur &quot;Analyser mes aides&quot; pour détecter les aides auxquelles vous avez droit
            </p>
          </div>
          <button onClick={analyser} disabled={loading} className="btn-shimmer disabled:opacity-60">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loading ? 'Analyse en cours…' : 'Analyser mes aides'}
          </button>
        </div>
      )}

      {/* Manque de documents */}
      {contenu?.type === 'manque_docs' && (
        <div className="rounded-xl p-6 flex flex-col gap-4" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(10px)',
        }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} style={{ color: '#f97316' }} />
            <p className="text-sm font-semibold" style={{ color: 'white' }}>Documents manquants</p>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{contenu.message}</p>
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>Documents utiles à ajouter :</p>
            <div className="flex flex-col gap-2">
              {contenu.docs_requis.map((doc) => (
                <div key={doc} className="flex items-center gap-3 p-3 rounded-lg" style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <FileText size={14} style={{ color: '#f97316', flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Liste des aides */}
      {contenu?.type === 'aides' && (
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {contenu.liste.length} aide{contenu.liste.length > 1 ? 's' : ''} détectée{contenu.liste.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contenu.liste.map((aide) => (
              <div key={aide.nom} className="rounded-xl p-5 flex flex-col gap-3" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.35)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'rgba(249,115,22,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: '16px' }}>💶</span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'white' }}>{aide.nom}</p>
                  </div>
                  {aide.lien && (
                    <a
                      href={aide.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0"
                      style={{
                        background: 'rgba(249,115,22,0.15)',
                        color: '#f97316',
                        border: '1px solid rgba(249,115,22,0.25)',
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={11} />
                      Voir
                    </a>
                  )}
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  {aide.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
