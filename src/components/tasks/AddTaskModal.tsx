'use client'

import { useActionState, useEffect, useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import { createTask, type TaskFormState } from '@/lib/actions/tasks'

interface AddTaskModalProps {
  onClose: () => void
  profiles: { id: string; full_name: string }[]
  outlets: { id: string; name: string; slug: string }[]
}

const CATEGORIES = ['video', 'design', 'copy', 'event', 'sales', 'partner']
const PRIORITIES = [
  { value: 'high',   label: 'High',   color: '#c9504c' },
  { value: 'medium', label: 'Medium', color: '#c9904c' },
  { value: 'low',    label: 'Low',    color: '#4caf7a' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#1a1a15',
  border: '1px solid #222220',
  borderRadius: '6px',
  padding: '9px 12px',
  color: '#e8e6df',
  fontSize: '13px',
  fontFamily: 'Outfit, sans-serif',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10.5px',
  color: '#a09a8e',
  fontFamily: 'DM Mono, monospace',
  letterSpacing: '0.06em',
  marginBottom: '5px',
}

const initialState: TaskFormState = {}

export function AddTaskModal({ onClose, profiles, outlets }: AddTaskModalProps) {
  const [state, formAction, isPending] = useActionState<TaskFormState, FormData>(createTask, initialState)
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('design')

  // Close on success
  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 51,
          width: '520px', maxWidth: '95vw',
          background: '#141410', border: '1px solid #2e2e28',
          borderRadius: '12px', overflow: 'hidden',
        }}
      >
        {/* Gold top line */}
        <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #222220', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={14} color="#c9a84c" />
            </div>
            <h2 className="font-display" style={{ fontSize: '18px', fontWeight: 600, color: '#e8e6df' }}>
              Tambah Task Baru
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a15', border: '1px solid #222220', color: '#5a5650', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <form action={formAction} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Hidden priority field (controlled by buttons) */}
          <input type="hidden" name="priority" value={priority} />

          {/* Title */}
          <div>
            <label style={labelStyle}>Judul Task *</label>
            <input
              name="title"
              style={inputStyle}
              placeholder="Contoh: Produksi video reels TSF"
              required
              onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.4)' }}
              onBlur={(e) => { e.target.style.borderColor = '#222220' }}
            />
          </div>

          {/* Category + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select
                name="category"
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Prioritas</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className="font-code"
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: '6px', fontSize: '10px',
                      fontFamily: 'DM Mono, monospace', cursor: 'pointer',
                      background: priority === p.value ? `${p.color}15` : '#1a1a15',
                      border: `1px solid ${priority === p.value ? `${p.color}60` : '#222220'}`,
                      color: priority === p.value ? p.color : '#5a5650',
                      transition: 'all 0.15s',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outlet + Assignee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Outlet</label>
              <select name="outlet_id" style={{ ...inputStyle, cursor: 'pointer' }} required>
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.slug.toUpperCase()} — {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Assignee</label>
              <select name="assigned_to" style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">— Belum ditentukan —</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label style={labelStyle}>Deadline</label>
            <input
              type="date"
              name="due_date"
              style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.4)' }}
              onBlur={(e) => { e.target.style.borderColor = '#222220' }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Deskripsi (opsional)</label>
            <textarea
              name="description"
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Detail task, referensi, atau catatan..."
              onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.4)' }}
              onBlur={(e) => { e.target.style.borderColor = '#222220' }}
            />
          </div>

          {/* Error */}
          {state.error && (
            <div style={{ background: 'rgba(201,80,76,0.1)', border: '1px solid rgba(201,80,76,0.2)', borderRadius: '6px', padding: '8px 12px' }}>
              <p style={{ fontSize: '12px', color: '#c9504c' }}>{state.error}</p>
            </div>
          )}

          {/* XP info */}
          <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <p className="font-code" style={{ fontSize: '10px', color: '#5a5650', lineHeight: 1.5 }}>
              Task <span style={{ color: '#c9a84c' }}>{category}</span> akan membuka{' '}
              <span style={{ color: '#c9a84c' }}>quest chain dengan XP reward</span> saat step diselesaikan.
              Total 100 XP tersedia.
            </p>
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              style={{
                flex: 1, padding: '10px', borderRadius: '6px', fontSize: '12.5px',
                fontFamily: 'Outfit, sans-serif', fontWeight: 500, cursor: 'pointer',
                background: '#1a1a15', border: '1px solid #222220', color: '#a09a8e',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                flex: 2, padding: '10px', borderRadius: '6px', fontSize: '12.5px',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
                background: isPending ? 'rgba(201,168,76,0.6)' : '#c9a84c',
                border: 'none', color: '#0c0c0a',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              {isPending ? <><Loader2 size={13} className="animate-spin" /> Menyimpan...</> : 'Buat Task'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
