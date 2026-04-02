import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TIMELINE_DATA, TIMELINE_DAYS, TIMELINE_TODAY_COLS } from './task-data'

export function TaskTimeline() {
  return (
    <div className="nx-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <p className="font-display" style={{ fontSize: '15px', fontWeight: 600, color: '#e8e6df' }}>
            Timeline April 2026
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="font-code"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: '6px', fontSize: '10px',
              background: '#1a1a15', border: '1px solid #222220',
              color: '#5a5650', cursor: 'pointer', fontFamily: 'DM Mono, monospace',
            }}
          >
            <ChevronLeft size={12} /> Mar
          </button>
          <button
            className="font-code"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: '6px', fontSize: '10px',
              background: '#1a1a15', border: '1px solid #222220',
              color: '#5a5650', cursor: 'pointer', fontFamily: 'DM Mono, monospace',
            }}
          >
            Mei <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Timeline grid */}
      <div style={{ overflowX: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid #222220', paddingBottom: '8px', marginBottom: '8px', minWidth: '600px' }}>
          <div
            className="font-code"
            style={{ width: '140px', flexShrink: 0, fontSize: '9.5px', color: '#5a5650' }}
          >
            Assignee
          </div>
          <div style={{ flex: 1, display: 'flex' }}>
            {TIMELINE_DAYS.map((day) => {
              const isToday = TIMELINE_TODAY_COLS.includes(day)
              return (
                <div
                  key={day}
                  className="font-code"
                  style={{
                    flex: 1, minWidth: '28px', textAlign: 'center',
                    fontSize: '8.5px',
                    color: isToday ? '#c9a84c' : '#5a5650',
                  }}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </div>

        {/* Rows */}
        {TIMELINE_DATA.map((row) => (
          <div
            key={row.name}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', minWidth: '600px' }}
          >
            <div style={{ width: '140px', flexShrink: 0, fontSize: '12px', color: '#a09a8e' }}>
              {row.name}
            </div>
            <div style={{ flex: 1, position: 'relative', height: '28px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: `${row.left}%`,
                  width: `${row.width}%`,
                  height: '22px',
                  top: '3px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  background: `${row.color}20`,
                  border: `1px solid ${row.color}60`,
                  color: row.color,
                  fontSize: '9.5px',
                  fontFamily: 'DM Mono, monospace',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                {row.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
        {[
          { color: 'rgba(201,168,76,0.5)',  label: 'On Progress' },
          { color: 'rgba(201,80,76,0.5)',   label: 'Overdue' },
          { color: 'rgba(76,175,122,0.5)',  label: 'Done' },
          { color: 'rgba(76,122,201,0.5)',  label: 'Review' },
        ].map((leg) => (
          <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '3px', background: leg.color, borderRadius: '1px' }} />
            <span className="font-code" style={{ fontSize: '9.5px', color: '#5a5650' }}>{leg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
