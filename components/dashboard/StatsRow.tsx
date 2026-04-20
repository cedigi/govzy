import React from 'react'

type Props = {
  documents: number
  aides: string
  alertes: number
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
}

export default function StatsRow({ documents, aides, alertes }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div style={cardStyle}>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#f97316' }}>{documents}</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Documents</div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#60a5fa' }}>{aides}</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Aides détectées</div>
      </div>
      <div style={cardStyle}>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#34d399' }}>{alertes}</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Alertes</div>
      </div>
    </div>
  )
}
