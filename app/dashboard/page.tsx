import { createClient } from '@/lib/supabase/server'
import StatsRow from '@/components/dashboard/StatsRow'
import EmptyStateWrapper from '@/components/dashboard/EmptyStateWrapper'
import DocumentUpload from '@/components/documents/DocumentUpload'
import AIAssistant from '@/components/dashboard/AIAssistant'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Document } from '@/lib/supabase/types'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('prenom')
    .eq('id', user!.id)
    .single() as { data: { prenom: string | null } | null; error: unknown }

  const { count: docCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const hasDocuments = (docCount ?? 0) > 0

  const { data: recentMessages } = await supabase
    .from('messages')
    .select('id, role, content')
    .eq('user_id', user!.id)
    .is('document_id', null)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1B3A6B]">
            Bonjour {profile?.prenom ?? 'utilisateur'} 👋
          </h1>
          <p className="text-sm text-slate-400">Que souhaitez-vous faire aujourd&apos;hui ?</p>
        </div>
        <DocumentUpload variant="button" />
      </div>

      {/* Stats */}
      <StatsRow
        documents={docCount ?? 0}
        aides="0€"
        alertes={0}
      />

      {/* Main area: empty state or recent docs + AI assistant */}
      <div className="flex gap-5 flex-1 min-h-0">
        <div className="flex-1 flex">
          {!hasDocuments ? (
            <EmptyStateWrapper />
          ) : (
            <RecentDocuments userId={user!.id} supabase={supabase} />
          )}
        </div>
        <div className="w-80 flex-shrink-0 h-[500px]">
          <AIAssistant messages={(recentMessages ?? []).reverse()} />
        </div>
      </div>
    </div>
  )
}

async function RecentDocuments({ userId, supabase }: { userId: string; supabase: SupabaseClient<Database> }) {
  const { data: documents } = await supabase
    .from('documents')
    .select('id, nom, type_detecte')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4">
      <h2 className="text-sm font-semibold text-[#1B3A6B] mb-3">Documents récents</h2>
      <div className="flex flex-col gap-2">
        {(documents ?? []).map((doc: Document) => (
          <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-[#1B3A6B]/10 flex items-center justify-center text-sm">📄</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{doc.nom}</p>
              <p className="text-xs text-slate-400">{doc.type_detecte ?? 'Analyse en cours…'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
