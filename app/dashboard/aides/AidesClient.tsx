'use client'
import { useState } from 'react'
import { Sparkles, ExternalLink, AlertCircle, Loader2, Upload } from 'lucide-react'
import type { SuggestionContenu, AideProbabilite } from '@/lib/supabase/types'
import DocumentUpload from '@/components/documents/DocumentUpload'

type DocEssentiel = {
  key: string
  label: string
  subtitle: string
  emoji: string
  present: boolean
}

type Props = {
  docsEssentiels: DocEssentiel[]
  initialContenu: SuggestionContenu | null
  lastAnalysedAt: string | null
}

const PROBABILITE_CONFIG: Record<AideProbabilite, { label: string; color: string; bg: string; dot: string }> = {
  confirmee: { label: 'Confirmée', color: '#34d399', bg: 'rgba(52,211,153,0.12)', dot: '#34d399' },
  probable:  { label: 'Probable',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', dot: '#60a5fa' },
  possible:  { label: 'Possible',  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', dot: '#fbbf24' },
  faible:    { label: 'Faible',    color: '#f87171', bg: 'rgba(248,113,113,0.12)', dot: '#f87171' },
}

export default function AidesClient({ docsEssentiels, initialContenu, lastAnalysedAt }: Props) {
  const [contenu, setContenu] = useState<SuggestionContenu | null>(initialContenu)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const docsPresents = docsEssentiels.filter(d => d.present).length
  const total = docsEssentiels.length
  const pct = Math.round((docsPresents / total) * 100)

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
        <button onClick={analyser} disabled={loading} className="btn-shimmer disabled:opacity-60">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? 'Analyse en cours…' : 'Analyser mes aides'}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </p>
      )}

      {/* Barre de progression profil */}
      <div className="rounded-xl p-5" style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(10px)',
      }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: 'white' }}>Profil administratif</p>
          <span className="text-sm font-bold" style={{ color: '#f97316' }}>{pct}%</span>
        </div>
        {/* Barre */}
        <div className="rounded-full mb-4" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
          <div className="rounded-full h-full transition-all duration-500" style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #f97316, #fbbf24)',
          }} />
        </div>
        <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Documents essentiels : {docsPresents}/{total} fournis
        </p>
        {/* Checklist */}
        <div className="grid grid-cols-2 gap-2">
          {docsEssentiels.map(doc => (
            <div key={doc.key} className="flex items-center gap-2 p-2.5 rounded-lg" style={{
              background: doc.present ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${doc.present ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <span style={{ fontSize: '14px' }}>{doc.present ? '✅' : '⬜'}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: doc.present ? '#34d399' : 'rgba(255,255,255,0.5)' }}>
                  {doc.label}
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{doc.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload contextuel pour docs manquants */}
        {docsPresents < total && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ajouter un document manquant
            </p>
            <div className="flex items-center gap-2">
              <Upload size={13} style={{ color: '#f97316' }} />
              <DocumentUpload variant="button" onSuccess={() => window.location.reload()} />
            </div>
          </div>
        )}
      </div>

      {/* Pas encore d'analyse */}
      {!contenu && (
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

      {/* Manque de docs */}
      {contenu?.type === 'manque_docs' && (
        <div className="rounded-xl p-6 flex flex-col gap-4" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(10px)',
        }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} style={{ color: '#fbbf24' }} />
            <p className="text-sm font-semibold" style={{ color: 'white' }}>Documents manquants</p>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{contenu.message}</p>
          <div className="flex flex-col gap-2">
            {contenu.docs_requis.map((doc) => (
              <div key={doc} className="flex items-center gap-3 p-3 rounded-lg" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#f97316' }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{doc}</span>
              </div>
            ))}
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
            {contenu.liste.map((aide) => {
              const prob = aide.probabilite ? PROBABILITE_CONFIG[aide.probabilite] : null
              return (
                <div key={aide.nom} className="rounded-xl p-5 flex flex-col gap-3" style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${prob ? prob.color + '30' : 'rgba(255,255,255,0.09)'}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  }}
                >
                  {/* Titre + badge probabilité */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(249,115,22,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: '14px',
                      }}>💶</div>
                      <p className="text-sm font-semibold leading-tight" style={{ color: 'white' }}>{aide.nom}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {prob && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                          background: prob.bg,
                          color: prob.color,
                        }}>
                          {prob.label}
                        </span>
                      )}
                      {aide.lien && (
                        <a href={aide.lien} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg"
                          style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)', textDecoration: 'none' }}
                        >
                          <ExternalLink size={11} />
                          Voir
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    {aide.description}
                  </p>

                  {/* Montant + doc requis */}
                  <div className="flex flex-wrap gap-2">
                    {aide.montant_possible && (
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{
                        background: 'rgba(52,211,153,0.1)',
                        color: '#34d399',
                        border: '1px solid rgba(52,211,153,0.2)',
                      }}>
                        💰 {aide.montant_possible}
                      </span>
                    )}
                    {aide.document_requis && (
                      <span className="text-xs px-2.5 py-1 rounded-lg" style={{
                        background: 'rgba(251,191,36,0.1)',
                        color: '#fbbf24',
                        border: '1px solid rgba(251,191,36,0.2)',
                      }}>
                        📎 {aide.document_requis}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
