import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DeleteAccountModal from '@/components/dashboard/DeleteAccountModal'
import { User, Mail, Shield } from 'lucide-react'

export default async function ComptePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom, nom')
    .eq('id', user.id)
    .single() as { data: { prenom: string | null; nom: string | null } | null; error: unknown }

  const glass = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '24px',
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Mon compte</h1>

      {/* Infos profil */}
      <div style={{ ...glass, marginBottom: '16px' }}>
        <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} color="#f97316" />
          Informations personnelles
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Prénom', value: profile?.prenom },
            { label: 'Nom', value: profile?.nom },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{label}</span>
              {value
                ? <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{value}</span>
                : <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontStyle: 'italic' }}>Non renseigné</span>
              }
            </div>
          ))}
        </div>
        {(!profile?.prenom || !profile?.nom) && (
          <p style={{ marginTop: '14px', fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
            Ces informations proviennent de votre inscription. Contactez{' '}
            <a href="mailto:hello.govzy@gmail.com" style={{ color: '#f97316', textDecoration: 'none' }}>hello.govzy@gmail.com</a>{' '}
            pour les mettre à jour.
          </p>
        )}
      </div>

      {/* Email */}
      <div style={{ ...glass, marginBottom: '16px' }}>
        <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={16} color="#f97316" />
          Identifiants
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Email</span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{user.email}</span>
        </div>
      </div>

      {/* Zone RGPD */}
      <div style={{ ...glass, borderColor: 'rgba(239,68,68,0.2)' }}>
        <h2 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="#ef4444" />
          Droits RGPD
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '20px', lineHeight: 1.5 }}>
          Conformément au Règlement Général sur la Protection des Données (Art. 17), vous pouvez demander la suppression définitive de l&apos;ensemble de vos données personnelles hébergées par Govzy.
        </p>
        <DeleteAccountModal />
      </div>
    </div>
  )
}
