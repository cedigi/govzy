'use client'
import { useState } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'

type Props = { prenom: string | null; nom: string | null }

export default function ProfileEditForm({ prenom: initialPrenom, nom: initialNom }: Props) {
  const [editing, setEditing] = useState(false)
  const [prenom, setPrenom] = useState(initialPrenom ?? '')
  const [nom, setNom] = useState(initialNom ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const inputStyle = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '13px',
    padding: '6px 10px',
    outline: 'none',
    width: '160px',
  } as React.CSSProperties

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom }),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setPrenom(initialPrenom ?? '')
    setNom(initialNom ?? '')
    setEditing(false)
    setError('')
  }

  const fieldStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
  const labelStyle = { color: 'rgba(255,255,255,0.4)', fontSize: '13px' }
  const valueStyle = { color: 'rgba(255,255,255,0.8)', fontSize: '13px' }
  const emptyStyle = { color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontStyle: 'italic' as const }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={fieldStyle}>
        <span style={labelStyle}>Prénom</span>
        {editing
          ? <input value={prenom} onChange={e => setPrenom(e.target.value)} style={inputStyle} placeholder="Votre prénom" autoFocus />
          : prenom ? <span style={valueStyle}>{prenom}</span> : <span style={emptyStyle}>Non renseigné</span>
        }
      </div>

      <div style={fieldStyle}>
        <span style={labelStyle}>Nom</span>
        {editing
          ? <input value={nom} onChange={e => setNom(e.target.value)} style={inputStyle} placeholder="Votre nom" />
          : nom ? <span style={valueStyle}>{nom}</span> : <span style={emptyStyle}>Non renseigné</span>
        }
      </div>

      {error && <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
              border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.08)',
              color: '#f97316', cursor: 'pointer',
            }}
          >
            <Pencil size={12} />
            {saved ? 'Modifié ✓' : 'Modifier'}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCancel}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            >
              <X size={12} /> Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, border: '1px solid rgba(249,115,22,0.4)', background: 'rgba(249,115,22,0.15)', color: '#f97316', cursor: saving ? 'wait' : 'pointer' }}
            >
              {saving ? <Loader2 size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Check size={12} />}
              Enregistrer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
