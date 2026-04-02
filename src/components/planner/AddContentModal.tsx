'use client'

import { useActionState, useEffect } from 'react'
import { createContentCard, type ContentFormState } from '@/lib/actions/content'
import { X } from 'lucide-react'

interface Props {
  onClose: () => void
}

const initialState: ContentFormState = {}

const CONTENT_TYPES = [
  { value: 'post',      label: 'Post' },
  { value: 'story',     label: 'Story' },
  { value: 'reel',      label: 'Reel' },
  { value: 'carousel',  label: 'Carousel' },
  { value: 'blog',      label: 'Blog' },
]

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok',    label: 'TikTok' },
  { value: 'facebook',  label: 'Facebook' },
  { value: 'all',       label: 'Semua Platform' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0c0c0a',
  border: '1px solid #222220',
  borderRadius: '6px',
  color: '#e8e6df',
  fontSize: '12.5px',
  padding: '8px 10px',
  fontFamily: 'Outfit, sans-serif',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  color: '#5a5650',
  marginBottom: '5px',
  fontFamily: 'DM Mono, monospace',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
}

export function AddContentModal({ onClose }: Props) {
  const [state, formAction, isPending] = useActionState(createContentCard, initialState)

  useEffect(() => {
    if (state.success) onClose()
  }, [state.success, onClose])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#141410',
          border: '1px solid #222220',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '460px',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#e8e6df', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.04em' }}>
              Tambah Konten Baru
            </h2>
            <p style={{ fontSize: '11px', color: '#5a5650', marginTop: '2px', fontFamily: 'DM Mono, monospace' }}>
              Content pipeline · Draft
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a5650', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Judul Konten *</label>
            <input
              name="title"
              type="text"
              placeholder="Judul konten..."
              required
              style={inputStyle}
            />
          </div>

          {/* Type + Platform row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Tipe *</label>
              <select name="type" required style={inputStyle}>
                <option value="">— pilih —</option>
                {CONTENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Platform</label>
              <select name="target_platform" style={inputStyle}>
                {PLATFORMS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Scheduled date */}
          <div>
            <label style={labelStyle}>Tanggal Tayang</label>
            <input
              name="scheduled_date"
              type="date"
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Deskripsi</label>
            <textarea
              name="description"
              placeholder="Deskripsi singkat konten..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Error */}
          {state.error && (
            <p style={{ fontSize: '11.5px', color: '#c9504c', fontFamily: 'DM Mono, monospace' }}>
              {state.error}
            </p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #222220',
                background: 'transparent',
                color: '#a09a8e',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                border: 'none',
                background: isPending ? '#5a4a20' : '#c9a84c',
                color: '#0c0c0a',
                fontSize: '12px',
                fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              {isPending ? 'Menyimpan...' : 'Simpan Konten'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
