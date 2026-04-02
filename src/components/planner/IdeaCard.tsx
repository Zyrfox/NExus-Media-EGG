'use client'

import { useTransition } from 'react'
import { voteContentIdea } from '@/lib/actions/content'
import { ChevronUp } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  brainstorm: '#c9904c',
  approved:   '#4caf7a',
  rejected:   '#c9504c',
  in_backlog: '#4c7ac9',
}

const STATUS_LABELS: Record<string, string> = {
  brainstorm: 'Brainstorm',
  approved:   'Disetujui',
  rejected:   'Ditolak',
  in_backlog: 'Backlog',
}

interface IdeaItem {
  id: string
  title: string
  description: string | null
  status: string
  votes: number
  hasVoted: boolean
  suggestedBy: { full_name: string } | null
}

interface Props {
  idea: IdeaItem
}

export function IdeaCard({ idea }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleVote = () => {
    startTransition(async () => {
      await voteContentIdea(idea.id)
    })
  }

  const statusColor = STATUS_COLORS[idea.status] ?? '#5a5650'
  const statusLabel = STATUS_LABELS[idea.status] ?? idea.status

  return (
    <div
      style={{
        background: '#141410',
        border: `1px solid ${idea.hasVoted ? 'rgba(201,168,76,0.2)' : '#222220'}`,
        borderRadius: '10px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span
          className="font-code"
          style={{
            fontSize: '9px',
            color: statusColor,
            background: `${statusColor}15`,
            padding: '2px 7px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {statusLabel}
        </span>
        {idea.suggestedBy && (
          <span className="font-code" style={{ fontSize: '9px', color: '#3a3a32' }}>
            {idea.suggestedBy.full_name.split(' ')[0]}
          </span>
        )}
      </div>

      {/* Title */}
      <p style={{ fontSize: '13px', color: '#e8e6df', fontFamily: 'Outfit, sans-serif', fontWeight: 500, lineHeight: 1.4 }}>
        {idea.title}
      </p>

      {/* Description */}
      {idea.description && (
        <p
          style={{
            fontSize: '11.5px',
            color: '#5a5650',
            fontFamily: 'Outfit, sans-serif',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {idea.description}
        </p>
      )}

      {/* Vote button */}
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={handleVote}
          disabled={isPending}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '6px',
            border: `1px solid ${idea.hasVoted ? 'rgba(201,168,76,0.3)' : '#222220'}`,
            background: idea.hasVoted ? 'rgba(201,168,76,0.08)' : 'transparent',
            color: idea.hasVoted ? '#c9a84c' : '#5a5650',
            cursor: isPending ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            fontFamily: 'Outfit, sans-serif',
            transition: 'all 0.15s',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          <ChevronUp size={12} />
          <span className="font-code" style={{ fontSize: '11px' }}>{idea.votes}</span>
          <span style={{ fontSize: '11px' }}>vote</span>
        </button>
      </div>
    </div>
  )
}
