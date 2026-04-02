'use client'

import { useTransition } from 'react'
import { moveContentCard } from '@/lib/actions/content'
import { ChevronRight, ChevronLeft, Calendar, Monitor } from 'lucide-react'

// Status order for forward/backward navigation
const STATUS_ORDER = ['draft', 'planned', 'in_production', 'ready', 'published'] as const
type ContentStatus = (typeof STATUS_ORDER)[number]

const PLATFORM_LABEL: Record<string, string> = {
  instagram: 'IG',
  tiktok:    'TT',
  facebook:  'FB',
  all:       'ALL',
}

const TYPE_COLORS: Record<string, string> = {
  post:     '#c9a84c',
  story:    '#4c7ac9',
  reel:     '#c9504c',
  carousel: '#4caf7a',
  blog:     '#a09a8e',
}

interface ContentCardItem {
  id: string
  title: string
  type: string
  target_platform: string
  scheduled_date: string | null
  outlet: { slug: string; brand_color: string } | null
}

interface Props {
  card: ContentCardItem
  currentStatus: ContentStatus
}

export function PipelineCard({ card, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition()

  const currentIdx = STATUS_ORDER.indexOf(currentStatus)
  const canMoveForward = currentIdx < STATUS_ORDER.length - 1
  const canMoveBack    = currentIdx > 0

  const handleMove = (direction: 'forward' | 'back') => {
    const newStatus = direction === 'forward'
      ? STATUS_ORDER[currentIdx + 1]
      : STATUS_ORDER[currentIdx - 1]
    if (!newStatus) return
    startTransition(async () => {
      await moveContentCard(card.id, newStatus)
    })
  }

  const typeColor = TYPE_COLORS[card.type] ?? '#5a5650'

  const scheduledLabel = card.scheduled_date
    ? new Date(card.scheduled_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    : null

  return (
    <div
      style={{
        background: '#1a1a15',
        border: '1px solid #222220',
        borderRadius: '8px',
        padding: '10px 12px',
        opacity: isPending ? 0.5 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {/* Type badge + platform */}
      <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
        <span
          className="font-code"
          style={{
            fontSize: '9px',
            color: typeColor,
            background: `${typeColor}15`,
            padding: '2px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {card.type}
        </span>
        <span
          className="font-code"
          style={{ fontSize: '9px', color: '#5a5650', display: 'flex', alignItems: 'center', gap: '3px' }}
        >
          <Monitor size={9} />
          {PLATFORM_LABEL[card.target_platform] ?? card.target_platform}
        </span>
      </div>

      {/* Title */}
      <p
        style={{
          fontSize: '12px',
          color: '#e8e6df',
          fontFamily: 'Outfit, sans-serif',
          lineHeight: 1.4,
          marginBottom: '8px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {card.title}
      </p>

      {/* Footer: date + outlet + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Outlet dot */}
          {card.outlet && (
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: card.outlet.brand_color,
                flexShrink: 0,
              }}
            />
          )}
          {scheduledLabel && (
            <span
              className="font-code"
              style={{ fontSize: '9px', color: '#5a5650', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <Calendar size={9} />
              {scheduledLabel}
            </span>
          )}
        </div>

        {/* Move buttons */}
        <div className="flex items-center gap-1">
          {canMoveBack && (
            <button
              onClick={() => handleMove('back')}
              disabled={isPending}
              title="Kembalikan"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: 'none',
                borderRadius: '4px',
                color: '#5a5650',
                cursor: isPending ? 'not-allowed' : 'pointer',
                padding: '3px 5px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={11} />
            </button>
          )}
          {canMoveForward && (
            <button
              onClick={() => handleMove('forward')}
              disabled={isPending}
              title="Majukan ke kolom berikut"
              style={{
                background: 'rgba(201,168,76,0.08)',
                border: 'none',
                borderRadius: '4px',
                color: '#c9a84c',
                cursor: isPending ? 'not-allowed' : 'pointer',
                padding: '3px 5px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronRight size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
