'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, Euro, Bell } from 'lucide-react'

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
    <aside className="w-[200px] bg-[#1B3A6B] flex flex-col items-stretch py-4 px-3 gap-1 flex-shrink-0 min-h-screen">
      {/* Logo */}
      <div className="bg-[#F97316] rounded-xl px-3 py-3 mb-4 text-center">
        <span className="text-white font-extrabold text-base tracking-widest">GOVZY</span>
      </div>

      {/* Nav */}
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              active ? 'bg-white/15' : 'hover:bg-white/10'
            }`}
          >
            <Icon size={18} className={active ? 'text-white' : 'text-white/60'} />
            <span className={`text-sm font-medium ${active ? 'text-white' : 'text-white/60'}`}>
              {label}
            </span>
          </Link>
        )
      })}

      {/* Avatar */}
      <div className="mt-auto flex items-center gap-3 px-3 py-2">
        <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">
            {prenom?.[0]?.toUpperCase() ?? 'U'}
          </span>
        </div>
        <span className="text-white/70 text-sm truncate">{prenom ?? 'Moi'}</span>
      </div>
    </aside>
  )
}
