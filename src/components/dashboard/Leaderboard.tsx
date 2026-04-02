interface LeaderEntry {
  rank: number
  initials: string
  name: string
  role: string
  score: number
  maxScore: number
  color: string
}

interface LeaderboardProps {
  entries: LeaderEntry[]
}

const RANK_COLORS: Record<number, string> = {
  1: '#c9a84c',
  2: '#a8a8a8',
  3: '#cd7f32',
}

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="nx-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <p className="font-display" style={{ fontSize: '15px', fontWeight: 600, color: '#e8e6df' }}>
          Leaderboard Tim
        </p>
        <span className="font-code" style={{ fontSize: '10px', color: '#c9a84c', cursor: 'pointer', letterSpacing: '0.04em' }}>
          Minggu ini
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {entries.map((entry) => {
          const rankColor = RANK_COLORS[entry.rank] ?? '#5a5650'
          const fillPct = (entry.score / entry.maxScore) * 100

          return (
            <div
              key={entry.rank}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 8px', background: '#1a1a15', borderRadius: '6px',
                border: '1px solid #222220',
              }}
            >
              {/* Rank */}
              <span
                className="font-code"
                style={{ fontSize: '11px', fontWeight: 500, color: rankColor, width: '14px', flexShrink: 0, textAlign: 'center' }}
              >
                {entry.rank}
              </span>

              {/* Avatar */}
              <div
                className="font-display"
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 600,
                  background: `${rankColor}20`, color: rankColor,
                }}
              >
                {entry.initials}
              </div>

              {/* Name + role */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', color: '#e8e6df', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {entry.name}
                </p>
                <p className="font-code" style={{ fontSize: '9px', color: '#5a5650', marginTop: '1px' }}>
                  {entry.role}
                </p>
              </div>

              {/* Mini bar */}
              <div style={{ width: '40px', height: '3px', background: '#222220', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ width: `${fillPct}%`, height: '100%', background: rankColor, borderRadius: '2px' }} />
              </div>

              {/* Score */}
              <span
                className="font-code"
                style={{ fontSize: '11px', fontWeight: 500, color: rankColor, flexShrink: 0, width: '24px', textAlign: 'right' }}
              >
                {entry.score}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
