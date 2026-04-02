'use client'

import { useTransition } from 'react'
import { markNotificationRead, markCopiedToWA } from '@/lib/actions/notifications'
import {
  CheckSquare,
  AlertCircle,
  Clock,
  ClipboardCheck,
  Trophy,
  Copy,
  Check,
} from 'lucide-react'
import { useState } from 'react'

type NotifType = 'task_assigned' | 'overdue' | 'deadline' | 'approve_needed' | 'achievement'

interface NotifItem {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  copied_to_wa: boolean
  created_at: string
  related_task_id: string | null
}

interface Props {
  notif: NotifItem
}

const TYPE_CONFIG: Record<NotifType, { icon: React.ReactNode; color: string; bg: string }> = {
  task_assigned: {
    icon:  <CheckSquare size={13} />,
    color: '#4c7ac9',
    bg:    'rgba(76,122,201,0.1)',
  },
  overdue: {
    icon:  <AlertCircle size={13} />,
    color: '#c9504c',
    bg:    'rgba(201,80,76,0.1)',
  },
  deadline: {
    icon:  <Clock size={13} />,
    color: '#c9904c',
    bg:    'rgba(201,144,76,0.1)',
  },
  approve_needed: {
    icon:  <ClipboardCheck size={13} />,
    color: '#a040d0',
    bg:    'rgba(160,64,208,0.1)',
  },
  achievement: {
    icon:  <Trophy size={13} />,
    color: '#c9a84c',
    bg:    'rgba(201,168,76,0.1)',
  },
}

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type as NotifType] ?? TYPE_CONFIG.task_assigned
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)

  if (mins  < 1)   return 'baru saja'
  if (mins  < 60)  return `${mins}m lalu`
  if (hours < 24)  return `${hours}j lalu`
  if (days  < 7)   return `${days}h lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export function NotificationItem({ notif }: Props) {
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied]          = useState(false)

  const cfg = getTypeConfig(notif.type)

  const handleRead = () => {
    if (notif.is_read) return
    startTransition(async () => {
      await markNotificationRead(notif.id)
    })
  }

  const handleCopyWA = async () => {
    const text =
      `🔔 *${notif.title}*\n${notif.message}\n\n— NEXUS MEDIA`

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      startTransition(async () => {
        await markCopiedToWA(notif.id)
      })
    } catch {
      // Clipboard not available (non-HTTPS dev env) — fallback silent fail
    }
  }

  return (
    <div
      onClick={handleRead}
      style={{
        display:       'flex',
        gap:           '12px',
        padding:       '14px 16px',
        background:    notif.is_read ? 'transparent' : 'rgba(201,168,76,0.03)',
        borderBottom:  '1px solid #1a1a15',
        cursor:        notif.is_read ? 'default' : 'pointer',
        transition:    'background 0.15s',
        opacity:       isPending ? 0.5 : 1,
        position:      'relative',
      }}
    >
      {/* Unread dot */}
      {!notif.is_read && (
        <span
          style={{
            position: 'absolute',
            left:     '6px',
            top:      '50%',
            transform:'translateY(-50%)',
            width:    '4px',
            height:   '4px',
            borderRadius: '50%',
            background: '#c9a84c',
          }}
        />
      )}

      {/* Type icon */}
      <div
        style={{
          width:          '32px',
          height:         '32px',
          borderRadius:   '8px',
          background:     cfg.bg,
          color:          cfg.color,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          marginTop:      '1px',
        }}
      >
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize:   '12.5px',
            color:      notif.is_read ? '#a09a8e' : '#e8e6df',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: notif.is_read ? 400 : 500,
            marginBottom: '3px',
            lineHeight: 1.4,
          }}
        >
          {notif.title}
        </p>
        <p
          style={{
            fontSize:   '11.5px',
            color:      '#5a5650',
            fontFamily: 'Outfit, sans-serif',
            lineHeight: 1.4,
            marginBottom: '6px',
          }}
        >
          {notif.message}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3">
          <span
            className="font-code"
            style={{ fontSize: '10px', color: '#3a3a32' }}
          >
            {timeAgo(notif.created_at)}
          </span>

          {/* Copy to WA */}
          <button
            onClick={(e) => { e.stopPropagation(); void handleCopyWA() }}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '4px',
              padding:    '2px 8px',
              borderRadius: '4px',
              border:     `1px solid ${notif.copied_to_wa ? '#222220' : 'rgba(76,175,122,0.25)'}`,
              background: 'transparent',
              color:      notif.copied_to_wa
                ? (copied ? '#4caf7a' : '#3a3a32')
                : '#4caf7a',
              fontSize:   '10px',
              cursor:     'pointer',
              fontFamily: 'DM Mono, monospace',
              transition: 'all 0.15s',
            }}
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? 'Copied!' : notif.copied_to_wa ? 'Sent' : 'Copy WA'}
          </button>
        </div>
      </div>
    </div>
  )
}
