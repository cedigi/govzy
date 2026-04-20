export default function AidesPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-bold text-[#1B3A6B]">Aides disponibles</h1>
      <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center gap-3 text-center">
        <span className="text-4xl">💶</span>
        <p className="text-sm font-semibold text-[#1B3A6B]">Bientôt disponible</p>
        <p className="text-xs text-slate-400">Vos aides et allocations personnalisées apparaîtront ici</p>
      </div>
    </div>
  )
}
