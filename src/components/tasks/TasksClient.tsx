'use client'

import { useState } from 'react'
import { List, LayoutGrid, GanttChart, Plus } from 'lucide-react'
import { Topbar } from '@/components/shared/Topbar'
import { TaskListView } from './TaskListView'
import { TaskKanban } from './TaskKanban'
import { TaskTimeline } from './TaskTimeline'
import { AddTaskModal } from './AddTaskModal'
import { TaskDetailModal } from './TaskDetailModal'
import type { TaskItem } from './task-data'

interface TasksClientProps {
  tasks: TaskItem[]
  profiles: { id: string; full_name: string }[]
  outlets: { id: string; name: string; slug: string }[]
}

type View = 'list' | 'kanban' | 'timeline'

const VIEWS: { key: View; label: string; Icon: React.ElementType }[] = [
  { key: 'list',     label: 'List',     Icon: List },
  { key: 'kanban',   label: 'Kanban',   Icon: LayoutGrid },
  { key: 'timeline', label: 'Timeline', Icon: GanttChart },
]

const STATUS_TAB_DEFS = [
  { key: 'all',         label: 'Semua'      },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review',      label: 'Review'      },
  { key: 'overdue',     label: 'Overdue'     },
  { key: 'done',        label: 'Done'        },
  { key: 'draft',       label: 'Draft'       },
] as const

export function TasksClient({ tasks, profiles, outlets }: TasksClientProps) {
  const [view, setView] = useState<View>('list')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const counts: Record<string, number> = {
    all:         tasks.length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    review:      tasks.filter((t) => t.status === 'review').length,
    overdue:     tasks.filter((t) => t.status === 'overdue').length,
    done:        tasks.filter((t) => t.status === 'done').length,
    draft:       tasks.filter((t) => t.status === 'draft').length,
  }

  return (
    <>
      <Topbar title="Task Manager" crumb="APRIL 2026 — SEMUA OUTLET" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Controls row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {STATUS_TAB_DEFS.map((tab) => {
              const active = filterStatus === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key)}
                  className="font-code"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '5px 12px', borderRadius: '6px', fontSize: '10px',
                    cursor: 'pointer', transition: 'all 0.15s',
                    background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                    border: active ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
                    color: active ? '#c9a84c' : '#5a5650',
                    fontFamily: 'DM Mono, monospace',
                  }}
                >
                  {tab.label}
                  <span style={{
                    fontSize: '9px', padding: '0 5px', borderRadius: '8px',
                    background: active ? 'rgba(201,168,76,0.15)' : '#1a1a15',
                    color: active ? '#c9a84c' : '#3a3a32',
                  }}>
                    {counts[tab.key] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>

          {/* View switcher + Add button */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: '#1a1a15', border: '1px solid #222220', borderRadius: '8px', padding: '3px', gap: '2px' }}>
              {VIEWS.map(({ key, label, Icon }) => {
                const active = view === key
                return (
                  <button
                    key={key}
                    onClick={() => setView(key)}
                    title={label}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '5px 10px', borderRadius: '6px', fontSize: '11px',
                      fontFamily: 'Outfit, sans-serif', cursor: 'pointer',
                      background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                      border: active ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
                      color: active ? '#c9a84c' : '#5a5650',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600, cursor: 'pointer',
                background: '#c9a84c', border: 'none', color: '#0c0c0a',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              <Plus size={14} />
              Tambah Task
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'list' && (
          <TaskListView
            tasks={tasks}
            filterStatus={filterStatus}
            onTaskClick={setSelectedTaskId}
          />
        )}
        {view === 'kanban' && (
          <TaskKanban
            tasks={tasks}
            onTaskClick={setSelectedTaskId}
          />
        )}
        {view === 'timeline' && <TaskTimeline />}
      </div>

      {showAddModal && (
        <AddTaskModal
          profiles={profiles}
          outlets={outlets}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedTaskId && (
        <TaskDetailModal
          tasks={tasks}
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </>
  )
}
