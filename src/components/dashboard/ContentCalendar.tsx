import Link from 'next/link'

export type DayStatus = 'normal' | 'has' | 'published' | 'late' | 'today' | 'empty'

export interface CalDay {
  date: number | null
  status: DayStatus
  dotColor?: string
}

interface ContentCalendarProps {
  month: string
  days: CalDay[]
}

const DAY_LABELS = ['SN', 'SL', 'RB', 'KM', 'JM', 'SB', 'MG']

const CELL_STYLES: Record<DayStatus, React.CSSProperties> = {
  normal:    { color: '#5a5650' },
  has:       { color: '#e8e6df' },
  published: { color: '#4caf7a' },
  late:      { color: '#c9504c', background: 'rgba(201,80,76,0.06)', border: '1px solid rgba(201,80,76,0.15)' },
  today:     { color: '#c9a84c', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', fontWeight: 600 },
  empty:     {},
}

export function ContentCalendar({ month, days }: ContentCalendarProps) {
  return (
    <div className="nx-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <p className="font-display" style={{ fontSize: '15px', fontWeight: 600, color: '#e8e6df' }}>
            Content Calendar
          </p>
          <p className="font-code" style={{ fontSize: '10px', color: '#5a5650', letterSpacing: '0.06em', marginTop: '2px' }}>
            {month}
          </p>
        </div>
        <Link
          href="/planner"
          className="font-code"
          style={{ fontSize: '10px', color: '#c9a84c', textDecoration: 'none', letterSpacing: '0.04em' }}
        >
          Buka →
        </Link>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
        {/* Day headers */}
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="font-code"
            style={{
              textAlign: 'center', fontSize: '8.5px', color: '#3a3a32',
              letterSpacing: '0.06em', paddingBottom: '4px',
            }}
          >
            {d}
          </div>
        ))}

        {/* Day cells */}
        {days.map((day, i) => {
          if (!day.date) {
            return <div key={`empty-${i}`} />
          }

          const cellStyle = CELL_STYLES[day.status]
          return (
            <div
              key={i}
              style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '4px 2px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: day.status !== 'normal' && day.status !== 'empty' ? 'pointer' : 'default',
                transition: 'background 0.15s',
                ...cellStyle,
              }}
            >
              {day.date}
              {day.dotColor && (
                <div style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  background: day.dotColor, marginTop: '2px',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {[
          { color: '#c9a84c', label: 'Planned' },
          { color: '#4caf7a', label: 'Published' },
          { color: '#c9504c', label: 'Late' },
        ].map((leg) => (
          <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: leg.color }} />
            <span className="font-code" style={{ fontSize: '8.5px', color: '#5a5650' }}>{leg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
