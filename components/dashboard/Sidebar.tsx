'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Euro, Bell } from 'lucide-react'
import Image from 'next/image'

const navItems = [
  { href: '/dashboard', label: 'Accueil', icon: Home },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/aides', label: 'Aides', icon: Euro },
  { href: '/dashboard/alertes', label: 'Alertes', icon: Bell },
]

type Props = { prenom: string | null }

export default function Sidebar({ prenom }: Props) {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '200px',
      flexShrink: 0,
      background: 'rgba(255,255,255,0.04)',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)',
      padding: '20px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minHeight: '100vh',
    }}>
      <div style={{ marginBottom: '20px', padding: '4px 8px' }}>
        <Image src="/logo-govzy.png" alt="Govzy" width={160} height={48} style={{ width: '100%', height: 'auto' }} priority />
      </div>

      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              color: active ? 'white' : 'rgba(255,255,255,0.5)',
              background: active ? 'rgba(249,115,22,0.15)' : 'transparent',
              border: active ? '1px solid rgba(249,115,22,0.25)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateX(0)'
              }
            }}
            onMouseDown={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateX(2px) scale(0.97)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.1)'
              ;(e.currentTarget as HTMLElement).style.color = '#f97316'
            }}
            onMouseUp={e => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'
              }
            }}
          >
            <Icon size={18} style={{ color: active ? 'white' : 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
            <span>{label}</span>
          </Link>
        )
      })}

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '13px', color: 'white', flexShrink: 0,
        }}>
          {prenom?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {prenom ?? 'Moi'}
        </span>
      </div>
    </aside>
  )
}
