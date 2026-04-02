import { MoreVertical } from 'lucide-react'
import { SAMPLE_TASKS, STATUS_BADGE, OUTLET_COLORS, type TaskStatus, type TaskItem } from './task-data'

interface TaskListViewProps {
  filterStatus: string
  onTaskClick: (id: string) => void
  tasks?: TaskItem[]
}

export function TaskListView({ filterStatus, onTaskClick, tasks: propTasks }: TaskListViewProps) {
  const source = propTasks ?? SAMPLE_TASKS
  const tasks = filterStatus === 'all'
    ? source
    : source.filter((t) => t.status === filterStatus)

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '24px 1fr 90px 70px 88px 100px 28px',
          gap: '12px',
          padding: '4px 14px',
          marginBottom: '4px',
        }}
      >
        {['', 'TASK', 'ASSIGNEE', 'OUTLET', 'DEADLINE', 'STATUS', ''].map((h, i) => (
          <div
            key={i}
            className="font-code"
            style={{ fontSize: '9.5px', color: '#5a5650', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Task rows */}
      {tasks.map((task) => {
        const badge = STATUS_BADGE[task.status as TaskStatus]
        const outletStyle = OUTLET_COLORS[task.outlet] ?? OUTLET_COLORS['All']

        return (
          <div
            key={task.id}
            onClick={() => onTaskClick(task.id)}
            style={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr 90px 70px 88px 100px 28px',
              gap: '12px',
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#141410',
              border: '1px solid #222220',
              marginBottom: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2e2e28'
              e.currentTarget.style.background = '#1a1a15'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#222220'
              e.currentTarget.style.background = '#141410'
            }}
          >
            {/* Priority dot */}
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: task.priorityColor, flexShrink: 0 }} />

            {/* Title + category */}
            <div>
              <p style={{ fontSize: '13px', color: '#e8e6df', fontWeight: 400 }}>{task.title}</p>
              <p className="font-code" style={{ fontSize: '10px', color: '#5a5650', marginTop: '2px' }}>
                {task.category} · {task.subcategory}
              </p>
            </div>

            {/* Assignee */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div
                className="font-display"
                style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 600,
                  background: `${task.assigneeColor}20`, color: task.assigneeColor,
                }}
              >
                {task.assigneeInitials}
              </div>
              <span style={{ fontSize: '10.5px', color: '#a09a8e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {task.assigneeName}
              </span>
            </div>

            {/* Outlet */}
            <div>
              <span
                className="font-code"
                style={{
                  fontSize: '9px', fontWeight: 500, letterSpacing: '0.04em',
                  padding: '2px 7px', borderRadius: '4px',
                  background: outletStyle.bg, color: outletStyle.color,
                }}
              >
                {task.outlet}
              </span>
            </div>

            {/* Deadline */}
            <div
              className="font-code"
              style={{ fontSize: '10.5px', color: task.isLate ? '#c9504c' : '#5a5650' }}
            >
              {task.deadline}
              {task.isLate && ' !'}
            </div>

            {/* Status badge */}
            <div>
              <span
                className="font-code"
                style={{
                  fontSize: '9px', fontWeight: 500, letterSpacing: '0.04em',
                  padding: '2px 8px', borderRadius: '4px',
                  background: badge.bg, color: badge.color,
                }}
              >
                {badge.label}
              </span>
            </div>

            {/* More menu */}
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '26px', height: '26px', borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#5a5650', background: 'transparent', border: 'none', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1f1f19'; e.currentTarget.style.color = '#a09a8e' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5a5650' }}
            >
              <MoreVertical size={13} />
            </button>
          </div>
        )
      })}

      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5a5650' }}>
          <p className="font-code" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>TIDAK ADA TASK</p>
        </div>
      )}
    </div>
  )
}
