import Link from 'next/link'

type TaskBadge = 'DONE' | 'PROG' | 'LATE' | 'REVIEW' | 'DRAFT'

interface RecentTask {
  id: string
  title: string
  outlet: string
  assignee: string
  badge: TaskBadge
}

interface RecentTasksProps {
  tasks: RecentTask[]
}

const BADGE_STYLES: Record<TaskBadge, { bg: string; color: string; dot: string }> = {
  DONE:   { bg: 'rgba(76,175,122,0.1)',  color: '#4caf7a', dot: '#4caf7a' },
  PROG:   { bg: 'rgba(201,168,76,0.08)', color: '#c9a84c', dot: '#c9a84c' },
  LATE:   { bg: 'rgba(201,80,76,0.1)',   color: '#c9504c', dot: '#c9504c' },
  REVIEW: { bg: 'rgba(76,122,201,0.1)',  color: '#4c7ac9', dot: '#4c7ac9' },
  DRAFT:  { bg: 'rgba(90,86,80,0.15)',   color: '#5a5650', dot: '#5a5650' },
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  return (
    <div className="nx-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <p className="font-display" style={{ fontSize: '15px', fontWeight: 600, color: '#e8e6df' }}>
          Task Terbaru
        </p>
        <Link
          href="/tasks"
          className="font-code"
          style={{ fontSize: '10px', color: '#c9a84c', textDecoration: 'none', letterSpacing: '0.04em' }}
        >
          Lihat semua →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {tasks.map((task) => {
          const style = BADGE_STYLES[task.badge]
          return (
            <div
              key={task.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', background: '#1a1a15', borderRadius: '6px',
                border: '1px solid #222220', cursor: 'pointer',
              }}
            >
              {/* Status dot */}
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot, flexShrink: 0 }} />

              {/* Title + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', color: '#e8e6df', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {task.title}
                </p>
                <p className="font-code" style={{ fontSize: '9.5px', color: '#5a5650', marginTop: '1px' }}>
                  {task.outlet} · {task.assignee}
                </p>
              </div>

              {/* Badge */}
              <span
                className="font-code"
                style={{
                  fontSize: '9px', fontWeight: 500, letterSpacing: '0.04em',
                  padding: '2px 7px', borderRadius: '4px',
                  background: style.bg, color: style.color, flexShrink: 0,
                }}
              >
                {task.badge}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
