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
    <aside className="w-[100px] bg-[#1B3A6B] flex flex-col items-stretch py-3 px-2 gap-1 flex-shrink-0 min-h-screen">
      {/* Logo */}
      <div className="bg-[#F97316] rounded-lg px-2 py-2 mb-3 text-center">
        <span className="text-white font-extrabold text-sm tracking-wide">GOVZY</span>
      </div>

      {/* Nav */}
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-2 py-2 transition-colors ${
              active ? 'bg-white/15' : 'hover:bg-white/10'
            }`}
          >
            <Icon size={14} className="text-white flex-shrink-0" />
            <span className={`text-[11px] font-medium leading-tight ${active ? 'text-white' : 'text-white/60'}`}>
              {label}
            </span>
          </Link>
        )
      })}

      {/* Avatar */}
      <div className="mt-auto flex items-center gap-2 px-2 py-2">
        <div className="w-6 h-6 rounded-full bg-[#F97316] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-bold">
            {prenom?.[0]?.toUpperCase() ?? 'U'}
          </span>
        </div>
        <span className="text-white/60 text-[10px] truncate">{prenom ?? 'Moi'}</span>
      </div>
    </aside>
  )
}
