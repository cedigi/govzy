'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle, X } from 'lucide-react'

export default function DeleteAccountModal() {
  const router = useRouter()
  const [step, setStep] = useState<'idle' | 'confirm1' | 'confirm2' | 'loading' | 'error'>('idle')
  const [inputValue, setInputValue] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const glass = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
  }

  const overlay: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  }

  async function handleDelete() {
    setStep('loading')
    try {
      const res = await fetch('/api/user/delete-all-data', { method: 'POST' })
      if (!res.ok && res.status !== 207) throw new Error('Erreur serveur')
      const data = await res.json()
      if (data.success) {
        router.push('/')
      } else {
        setErrorMsg('Suppression partielle. Contactez hello.govzy@gmail.com.')
        setStep('error')
      }
    } catch {
      setErrorMsg('Une erreur est survenue. Réessayez ou contactez le support.')
      setStep('error')
    }
  }

  return (
    <>
      <button
        onClick={() => setStep('confirm1')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          borderRadius: '10px',
          border: '1px solid rgba(239,68,68,0.4)',
          background: 'rgba(239,68,68,0.08)',
          color: '#ef4444',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.6)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.4)'
        }}
      >
        <Trash2 size={16} />
        Supprimer toutes mes données
      </button>

      {(step === 'confirm1' || step === 'confirm2' || step === 'loading' || step === 'error') && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget && step !== 'loading') { setStep('idle'); setInputValue('') } }}>
          <div style={{ ...glass, padding: '28px', maxWidth: '440px', width: '100%' }}>

            {step === 'confirm1' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={20} color="#ef4444" />
                    <h2 style={{ color: 'white', fontSize: '17px', fontWeight: 600, margin: 0 }}>Supprimer mes données</h2>
                  </div>
                  <button onClick={() => setStep('idle')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                    Cette action supprimera <strong style={{ color: 'white' }}>définitivement et irréversiblement</strong> :<br />
                    — Tous vos documents uploadés<br />
                    — Toutes vos analyses et suggestions d&apos;aides<br />
                    — Votre profil et votre compte<br /><br />
                    Conformément au RGPD (Art. 17), vous avez le droit à l&apos;effacement. Cette action est permanente.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setStep('idle')}
                    style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setStep('confirm2')}
                    style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                  >
                    Continuer
                  </button>
                </div>
              </>
            )}

            {step === 'confirm2' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <h2 style={{ color: 'white', fontSize: '17px', fontWeight: 600, margin: 0 }}>Confirmation finale</h2>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>
                  Tapez <strong style={{ color: 'white', fontFamily: 'monospace' }}>SUPPRIMER</strong> pour confirmer la suppression définitive de toutes vos données.
                </p>

                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="SUPPRIMER"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    outline: 'none',
                    marginBottom: '20px',
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => { setStep('idle'); setInputValue('') }}
                    style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={inputValue !== 'SUPPRIMER'}
                    style={{
                      padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: inputValue === 'SUPPRIMER' ? 'pointer' : 'not-allowed',
                      border: '1px solid rgba(239,68,68,0.5)',
                      background: inputValue === 'SUPPRIMER' ? 'rgba(239,68,68,0.8)' : 'rgba(239,68,68,0.15)',
                      color: inputValue === 'SUPPRIMER' ? 'white' : 'rgba(239,68,68,0.5)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Supprimer définitivement
                  </button>
                </div>
              </>
            )}

            {step === 'loading' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Suppression en cours…</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            )}

            {step === 'error' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <AlertTriangle size={20} color="#ef4444" />
                  <h2 style={{ color: 'white', fontSize: '17px', fontWeight: 600, margin: 0 }}>Erreur</h2>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>{errorMsg}</p>
                <button
                  onClick={() => { setStep('idle'); setInputValue(''); setErrorMsg('') }}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer' }}
                >
                  Fermer
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
