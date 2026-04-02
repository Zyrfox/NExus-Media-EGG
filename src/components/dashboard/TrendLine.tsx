interface TrendLineProps {
  currentRate: number
  startLabel?: string
  midLabel?: string
  endLabel?: string
}

export function TrendLine({ currentRate, startLabel = '1 Apr', midLabel = '15 Apr', endLabel }: TrendLineProps) {
  const today = new Date()
  const end = endLabel ?? `${today.getDate()} ${today.toLocaleString('id-ID', { month: 'short' })} ↑`

  return (
    <div className="nx-card" style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <p className="font-display" style={{ fontSize: '15px', fontWeight: 600, color: '#e8e6df' }}>
            Tren Completion Rate
          </p>
          <p className="font-code" style={{ fontSize: '10px', color: '#5a5650', letterSpacing: '0.06em', marginTop: '2px' }}>
            30 Hari Terakhir — Semua Outlet
          </p>
        </div>
        <span className="font-display" style={{ fontSize: '28px', fontWeight: 700, color: '#c9a84c' }}>
          {currentRate}%
        </span>
      </div>

      {/* SVG line chart — pixel-perfect match to HTML reference */}
      <svg width="100%" height="80" viewBox="0 0 800 80" preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(201,168,76,0.2)" />
            <stop offset="100%" stopColor="rgba(201,168,76,0)" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1="0" y1="60" x2="800" y2="60" stroke="#222220" strokeWidth="0.5" />
        <line x1="0" y1="38" x2="800" y2="38" stroke="#222220" strokeWidth="0.5" />
        <line x1="0" y1="16" x2="800" y2="16" stroke="#222220" strokeWidth="0.5" />

        {/* Area fill */}
        <path
          d="M0,60 C40,54 80,62 120,48 C160,34 200,40 240,28 C280,16 320,24 360,15 C400,6 440,18 480,11 C520,4 560,14 600,8 C640,2 680,9 720,4 C760,0 800,5 800,4 L800,80 L0,80 Z"
          fill="url(#trendGrad)"
        />

        {/* Line */}
        <path
          d="M0,60 C40,54 80,62 120,48 C160,34 200,40 240,28 C280,16 320,24 360,15 C400,6 440,18 480,11 C520,4 560,14 600,8 C640,2 680,9 720,4 C760,0 800,5 800,4"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* End dot */}
        <circle cx="800" cy="4" r="3" fill="#c9a84c" />
        <circle cx="800" cy="4" r="7" fill="rgba(201,168,76,0.2)" />
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span className="font-code" style={{ fontSize: '9px', color: '#5a5650' }}>{startLabel}</span>
        <span className="font-code" style={{ fontSize: '9px', color: '#5a5650' }}>{midLabel}</span>
        <span className="font-code" style={{ fontSize: '9px', color: '#c9a84c' }}>{end}</span>
      </div>
    </div>
  )
}
