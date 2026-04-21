import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DocumentsLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom')
    .eq('id', user.id)
    .single() as { data: { prenom: string | null } | null; error: unknown }

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)' }}>
      <Sidebar prenom={profile?.prenom ?? null} />
      <main className="flex-1 p-6 overflow-auto flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <p className="mt-8 text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
          Govzy est une initiative privée indépendante, sans affiliation avec l&apos;État belge.
          Les analyses IA sont indicatives — vérifiez toujours auprès des organismes compétents (CPAS, SPF, mutuelle).
        </p>
      </main>
    </div>
  )
}
