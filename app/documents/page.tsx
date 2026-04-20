import { createClient } from '@/lib/supabase/server'
import DocumentCard from '@/components/documents/DocumentCard'
import DocumentUpload from '@/components/documents/DocumentUpload'

export default async function DocumentsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: documents, error: docsError } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false }) as { data: import('@/lib/supabase/types').Document[] | null; error: unknown }

  if (docsError) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-lg font-bold" style={{ color: 'white' }}>Mes documents</h1>
        <div className="text-sm p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}>
          Erreur lors du chargement des documents. Veuillez réessayer.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold" style={{ color: 'white' }}>Mes documents</h1>
        <DocumentUpload variant="button" />
      </div>

      {!documents?.length ? (
        <div className="rounded-xl p-12 flex flex-col items-center gap-3 text-center" style={{
          border: '2px dashed rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)',
        }}>
          <span className="text-4xl">📂</span>
          <p className="text-sm font-semibold" style={{ color: 'white' }}>Aucun document pour l&apos;instant</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Scannez ou importez votre premier document</p>
          <DocumentUpload variant="button" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  )
}
