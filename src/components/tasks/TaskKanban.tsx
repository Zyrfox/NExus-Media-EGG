import { SAMPLE_TASKS, KANBAN_COLUMNS, STATUS_BADGE, OUTLET_COLORS, type TaskStatus, type TaskItem } from './task-data'

interface TaskKanbanProps {
  onTaskClick: (id: string) => void
  tasks?: TaskItem[]
}

export function TaskKanban({ onTaskClick, tasks: propTasks }: TaskKanbanProps) {
  const source = propTasks ?? SAMPLE_TASKS
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', minHeight: '400px' }}>
      {KANBAN_COLUMNS.map((col) => {
        const colTasks = source.filter((t) => t.status === col.key)
        const badge = STATUS_BADGE[col.key as TaskStatus]

        return (
          <div
            key={col.key}
            style={{
              background: '#1a1a15', borderRadius: '10px',
              padding: '12px', border: '1px solid #222220',
            }}
          >
            {/* Column header */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '10px', paddingBottom: '10px',
                borderBottom: `1px solid ${col.color ? `${col.color}40` : '#222220'}`,
              }}
            >
              <span
                className="font-code"
                style={{
                  fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: col.color ?? '#5a5650',
                }}
              >
                {col.label}
              </span>
              <span
                className="font-code"
                style={{
                  fontSize: '10px',
                  padding: '1px 7px', borderRadius: '10px',
                  background: col.countBg ?? '#1f1f19',
                  color: col.color ?? '#5a5650',
                }}
              >
                {colTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div>
              {colTasks.map((task) => {
                const outletStyle = OUTLET_COLORS[task.outlet] ?? OUTLET_COLORS['All']
                const isOverdue = task.status === 'overdue'

                return (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task.id)}
                    style={{
                      background: '#141410',
                      border: `1px solid ${isOverdue ? 'rgba(201,80,76,0.25)' : '#222220'}`,
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = isOverdue ? 'rgba(201,80,76,0.5)' : '#2e2e28'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isOverdue ? 'rgba(201,80,76,0.25)' : '#222220'
                    }}
                  >
                    {/* Title */}
                    <p style={{ fontSize: '12px', color: '#e8e6df', lineHeight: 1.4, marginBottom: '8px' }}>
                      {task.title}
                    </p>

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-code"
                            style={{
                              fontSize: '9px', padding: '1px 6px', borderRadius: '4px',
                              background: badge.bg, color: badge.color,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        <span
                          className="font-code"
                          style={{
                            fontSize: '9px', padding: '1px 6px', borderRadius: '4px',
                            background: outletStyle.bg, color: outletStyle.color,
                          }}
                        >
                          {task.outlet}
                        </span>
                      </div>
                    )}

                    {/* Meta: avatar + deadline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div
                        className="font-display"
                        style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '9px', fontWeight: 600, flexShrink: 0,
                          background: `${task.assigneeColor}20`, color: task.assigneeColor,
                        }}
                      >
                        {task.assigneeInitials}
                      </div>
                      <span
                        className="font-code"
                        style={{
                          fontSize: '10px',
                          color: task.status === 'done' ? '#4caf7a'
                               : task.isLate ? '#c9504c'
                               : task.deadline.includes('Apr') ? '#c9a84c'
                               : '#5a5650',
                          marginLeft: 'auto',
                        }}
                      >
                        {task.status === 'done' ? `✓ ${task.doneDate ?? task.deadline}` : task.deadline}
                        {task.isLate && ' !'}
                      </span>
                    </div>
                  </div>
                )
              })}

              {colTasks.length === 0 && (
                <div
                  style={{
                    textAlign: 'center', padding: '20px 0',
                    border: '1px dashed #222220', borderRadius: '8px',
                  }}
                >
                  <p className="font-code" style={{ fontSize: '9px', color: '#3a3a32', letterSpacing: '0.08em' }}>
                    KOSONG
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
