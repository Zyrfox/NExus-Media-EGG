interface CategoryItem {
  label: string
  pct: number
  color: string
}

interface OutletStat {
  label: string
  count: number
  color: string
  span?: boolean
}

interface TaskDistributionProps {
  completionRate: number
  categories: CategoryItem[]
  outletStats: OutletStat[]
}

// Build SVG donut segments
function buildDonutPath(categories: CategoryItem[], r = 34, cx = 45, cy = 45, strokeWidth = 9) {
  const circumference = 2 * Math.PI * r
  let offset = 0
  return categories.map((cat) => {
    const dash = (cat.pct / 100) * circumference
    const gap = circumference - dash
    const el = (
      <circle
        key={cat.label}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={cat.color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash.toFixed(1)} ${gap.toFixed(1)}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
      />
    )
    offset += dash
    return el
  })
}

export function TaskDistribution({ completionRate, categories, outletStats }: TaskDistributionProps) {
  return (
    <div className="nx-card">
      <div style={{ marginBottom: '16px' }}>
        <p className="font-display" style={{ fontSize: '15px', fontWeight: 600, color: '#e8e6df' }}>
          Distribusi Task
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Donut SVG */}
        <svg
          width="90" height="90" viewBox="0 0 90 90"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', flexShrink: 0 }}
        >
          {/* Track */}
          <circle cx="45" cy="45" r="34" fill="none" stroke="#1f1f19" strokeWidth="9" />
          {/* Segments */}
          {buildDonutPath(categories)}
        </svg>
        {/* Center label (not rotated — use foreignObject workaround with absolute) */}
        <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, marginLeft: '-90px' }}>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="font-display" style={{ fontSize: '16px', fontWeight: 700, color: '#e8e6df', lineHeight: 1 }}>
              {completionRate}%
            </span>
            <span className="font-code" style={{ fontSize: '7px', color: '#5a5650', letterSpacing: '0.08em', marginTop: '2px' }}>
              DONE
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {categories.map((cat) => (
            <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
              <span style={{ color: '#a09a8e', flex: 1 }}>{cat.label}</span>
              <span className="font-code" style={{ fontSize: '10.5px', color: '#e8e6df' }}>{cat.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="nx-divider" />

      {/* Per-outlet mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {outletStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#1a1a15', borderRadius: '6px', padding: '8px 10px',
              border: '1px solid #222220',
              gridColumn: stat.span ? 'span 2' : undefined,
            }}
          >
            <div className="font-code" style={{ fontSize: '9.5px', color: '#5a5650', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
              {stat.label}
            </div>
            <div className="font-display" style={{ fontSize: '22px', fontWeight: 600, color: stat.color }}>
              {stat.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
