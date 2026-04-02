'use client'

import { useState } from 'react'
import { X, Zap, Skull } from 'lucide-react'
import { SAMPLE_TASKS, STATUS_BADGE, OUTLET_COLORS, type TaskStatus, type TaskItem } from './task-data'
import { TASK_STEPS } from '@/types'
import type { TaskCategory } from '@/types'

interface TaskDetailModalProps {
  taskId: string | null
  onClose: () => void
  tasks?: TaskItem[]
}

// Map task category strings to type keys
const CATEGORY_MAP: Record<string, TaskCategory> = {
  'Konten': 'design',
  'Video': 'video',
  'Asset': 'design',
  'Vendor': 'partner',
  'Sosmed': 'copy',
  'Laporan': 'copy',
  'Admin': 'copy',
}

export function TaskDetailModal({ taskId, onClose, tasks: propTasks }: TaskDetailModalProps) {
  const source = propTasks ?? SAMPLE_TASKS
  const task = source.find((t) => t.id === taskId)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [xpGained, setXpGained] = useState(0)
  const [showXpPop, setShowXpPop] = useState<{ xp: number; key: string } | null>(null)

  if (!task || !taskId) return null

  const categoryKey = CATEGORY_MAP[task.category] ?? 'copy'
  const steps = TASK_STEPS[categoryKey]
  const totalXp = steps.reduce((sum, s) => sum + (completedSteps.has(s.code) ? s.weight : 0), 0)
  const badge = STATUS_BADGE[task.status as TaskStatus]
  const outletStyle = OUTLET_COLORS[task.outlet] ?? OUTLET_COLORS['All']

  function handleCompleteStep(code: string, weight: number) {
    if (completedSteps.has(code)) return
    const next = new Set(completedSteps)
    next.add(code)
    setCompletedSteps(next)
    setXpGained((prev) => prev + weight)
    setShowXpPop({ xp: weight, key: `${code}-${Date.now()}` })
    setTimeout(() => setShowXpPop(null), 1200)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 51,
          width: '580px', maxWidth: '95vw', maxHeight: '88vh',
          background: '#141410', border: '1px solid #2e2e28',
          borderRadius: '12px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Gold top accent */}
        <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />

        {/* Header */}
        <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              {/* Category + outlet badges */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <span className="font-code" style={{
                  fontSize: '9px', padding: '2px 8px', borderRadius: '4px',
                  background: badge.bg, color: badge.color, fontWeight: 500,
                }}>
                  {badge.label}
                </span>
                <span className="font-code" style={{
                  fontSize: '9px', padding: '2px 8px', borderRadius: '4px',
                  background: outletStyle.bg, color: outletStyle.color,
                }}>
                  {task.outlet}
                </span>
                <span className="font-code" style={{
                  fontSize: '9px', padding: '2px 8px', borderRadius: '4px',
                  background: '#1f1f19', color: '#5a5650',
                }}>
                  {task.category}
                </span>
              </div>

              <h2 className="font-display" style={{ fontSize: '20px', fontWeight: 600, color: '#e8e6df', lineHeight: 1.3 }}>
                {task.title}
              </h2>

              {/* Meta row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="font-display" style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 600,
                    background: `${task.assigneeColor}20`, color: task.assigneeColor,
                  }}>
                    {task.assigneeInitials}
                  </div>
                  <span style={{ fontSize: '12px', color: '#a09a8e' }}>{task.assigneeName}</span>
                </div>
                <span className="font-code" style={{ fontSize: '10px', color: task.isLate ? '#c9504c' : '#5a5650' }}>
                  Deadline: {task.deadline}
                </span>
                {/* XP earned this session */}
                {xpGained > 0 && (
                  <span className="font-code" style={{
                    fontSize: '10px', color: '#c9a84c',
                    background: 'rgba(201,168,76,0.08)', padding: '2px 8px', borderRadius: '10px',
                  }}>
                    +{xpGained} XP earned
                  </span>
                )}
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#1a1a15', border: '1px solid #222220',
                color: '#5a5650', cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="font-code" style={{ fontSize: '9px', color: '#5a5650', letterSpacing: '0.08em' }}>PROGRESS</span>
              <span className="font-code" style={{ fontSize: '9px', color: '#c9a84c' }}>{totalXp} / 100 XP</span>
            </div>
            <div style={{ height: '4px', background: '#222220', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                width: `${totalXp}%`, height: '100%', borderRadius: '2px',
                background: 'linear-gradient(to right, #c9a84c, #e8c86a)',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)', opacity: 0.15, margin: '16px 0 0' }} />
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
          {/* XP popup */}
          {showXpPop && (
            <div
              key={showXpPop.key}
              style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none', zIndex: 60,
                fontSize: '28px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700,
                color: '#c9a84c',
                animation: 'xpFloat 1.2s ease forwards',
              }}
            >
              +{showXpPop.xp} XP
            </div>
          )}

          {/* QUEST STEPS */}
          <p className="font-code" style={{ fontSize: '9px', color: '#5a5650', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
            QUEST STEPS — {task.category.toUpperCase()}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {steps.map((step, idx) => {
              const done = completedSteps.has(step.code)
              const prevDone = idx === 0 || completedSteps.has(steps[idx - 1].code)
              const isActive = !done && prevDone
              const isLocked = !done && !prevDone

              return (
                <div
                  key={step.code}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', borderRadius: '8px',
                    background: done ? 'rgba(76,175,122,0.06)'
                              : step.isFinal && isActive ? 'rgba(201,80,76,0.06)'
                              : isActive ? 'rgba(201,168,76,0.04)'
                              : '#1a1a15',
                    border: `1px solid ${
                      done ? 'rgba(76,175,122,0.2)'
                      : step.isFinal && isActive ? 'rgba(201,80,76,0.3)'
                      : isActive ? 'rgba(201,168,76,0.2)'
                      : '#222220'
                    }`,
                    opacity: isLocked ? 0.4 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Step number / check */}
                  <div
                    style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontFamily: 'DM Mono, monospace', fontWeight: 500,
                      background: done ? 'rgba(76,175,122,0.15)'
                                : step.isFinal && isActive ? 'rgba(201,80,76,0.15)'
                                : isActive ? 'rgba(201,168,76,0.12)'
                                : '#1f1f19',
                      color: done ? '#4caf7a'
                             : step.isFinal && isActive ? '#c9504c'
                             : isActive ? '#c9a84c'
                             : '#3a3a32',
                    }}
                  >
                    {done ? '✓' : step.isFinal ? <Skull size={12} /> : idx + 1}
                  </div>

                  {/* Step info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <p style={{
                        fontSize: '13px', fontWeight: 400,
                        color: done ? '#4caf7a'
                               : step.isFinal && isActive ? '#c9504c'
                               : isActive ? '#e8e6df'
                               : '#5a5650',
                      }}>
                        {step.isFinal ? '☠ ' : ''}{step.name}
                      </p>
                      {step.isFinal && (
                        <span className="font-code" style={{ fontSize: '8px', color: '#c9504c', background: 'rgba(201,80,76,0.1)', padding: '1px 5px', borderRadius: '3px' }}>
                          BOSS
                        </span>
                      )}
                    </div>
                    <p className="font-code" style={{ fontSize: '10px', color: '#3a3a32', marginTop: '2px' }}>
                      {step.weight} XP · Step {idx + 1} of {steps.length}
                    </p>
                  </div>

                  {/* Action button */}
                  {!done && isActive && (
                    <button
                      onClick={() => handleCompleteStep(step.code, step.weight)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 12px', borderRadius: '6px', fontSize: '11px',
                        fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                        background: step.isFinal ? '#c9504c' : '#c9a84c',
                        color: '#0c0c0a', border: 'none', cursor: 'pointer',
                        flexShrink: 0, transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                    >
                      <Zap size={11} />
                      {step.isFinal ? 'Final!' : 'Done'}
                    </button>
                  )}

                  {done && (
                    <span className="font-code" style={{ fontSize: '10px', color: '#4caf7a', flexShrink: 0 }}>
                      +{step.weight} XP ✓
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes xpFloat {
          0%   { opacity:0; transform:translate(-50%,-40%); }
          30%  { opacity:1; transform:translate(-50%,-60%); }
          100% { opacity:0; transform:translate(-50%,-80%); }
        }
      `}</style>
    </>
  )
}
