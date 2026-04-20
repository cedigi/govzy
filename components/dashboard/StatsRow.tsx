type Props = {
  documents: number
  aides: string
  alertes: number
}

export default function StatsRow({ documents, aides, alertes }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="text-2xl font-black text-[#1B3A6B]">{documents}</div>
        <div className="text-xs text-slate-400 mt-0.5">Documents</div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="text-2xl font-black text-[#F97316]">{aides}</div>
        <div className="text-xs text-slate-400 mt-0.5">Aides détectées</div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="text-2xl font-black text-red-500">{alertes}</div>
        <div className="text-xs text-slate-400 mt-0.5">Alertes</div>
      </div>
    </div>
  )
}
