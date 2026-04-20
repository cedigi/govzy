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
        <h1 className="text-lg font-bold text-[#1B3A6B]">Mes documents</h1>
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-200">
          Erreur lors du chargement des documents. Veuillez réessayer.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#1B3A6B]">Mes documents</h1>
        <DocumentUpload variant="button" />
      </div>

      {!documents?.length ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">📂</span>
          <p className="text-sm font-semibold text-[#1B3A6B]">Aucun document pour l&apos;instant</p>
          <p className="text-xs text-slate-400">Scannez ou importez votre premier document</p>
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
