interface KpiCard {
  label: string
  value: string | number
  suffix?: string
  delta?: string
  deltaUp?: boolean
  color?: string
  barWidth?: number
  icon: React.ReactNode
  iconBg: string
}

interface KpiCardsProps {
  cards: KpiCard[]
}

export function KpiCards({ cards }: KpiCardsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '14px' }}>
      {cards.map((card, i) => (
        <div key={i} className="nx-card" style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: card.iconBg, flexShrink: 0,
              }}
            >
              {card.icon}
            </div>
            {card.delta && (
              <span
                className="font-code"
                style={{
                  fontSize: '10px',
                  color: card.deltaUp ? '#4caf7a' : '#c9504c',
                  background: card.deltaUp ? 'rgba(76,175,122,0.1)' : 'rgba(201,80,76,0.1)',
                  padding: '2px 7px', borderRadius: '10px', fontWeight: 500,
                }}
              >
                {card.delta}
              </span>
            )}
          </div>

          <div
            className="font-display"
            style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.01em', color: card.color ?? '#e8e6df' }}
          >
            {card.value}
            {card.suffix && (
              <span style={{ fontSize: '18px', color: '#5a5650', fontWeight: 300 }}>{card.suffix}</span>
            )}
          </div>
          <div
            className="font-code"
            style={{ fontSize: '10px', color: '#5a5650', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}
          >
            {card.label}
          </div>

          <div className="nx-bar-track" style={{ marginTop: '10px' }}>
            <div
              className="nx-bar-fill"
              style={{ width: `${card.barWidth ?? 50}%`, background: card.color ?? '#c9a84c' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
