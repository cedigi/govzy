export default function AidesPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-bold" style={{ color: 'white' }}>Aides disponibles</h1>
      <div className="rounded-xl p-12 flex flex-col items-center gap-3 text-center" style={{
        border: '2px dashed rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.03)',
      }}>
        <span className="text-4xl">💶</span>
        <p className="text-sm font-semibold" style={{ color: 'white' }}>Bientôt disponible</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Vos aides et allocations personnalisées apparaîtront ici</p>
      </div>
    </div>
  )
}
