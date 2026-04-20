'use client'
import { FileText } from 'lucide-react'

type Props = { onUploadClick: () => void }

export default function EmptyState({ onUploadClick }: Props) {
  return (
    <div
      className="flex-1 bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 p-8 cursor-pointer hover:border-[#F97316] transition-colors"
      onClick={onUploadClick}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
        <FileText size={24} className="text-slate-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#1B3A6B]">Scanner votre premier document</p>
        <p className="text-xs text-slate-400 mt-1">Fiche de paie, contrat, facture…</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onUploadClick() }}
        className="bg-[#F97316] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        + Ajouter
      </button>
    </div>
  )
}
