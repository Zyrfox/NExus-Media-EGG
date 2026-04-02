'use client'

import { useTransition } from 'react'
import { markAllNotificationsRead } from '@/lib/actions/notifications'
import { NotificationItem } from './NotificationItem'
import { NotificationsRealtimeListener } from './NotificationsRealtimeListener'
import { Bell, CheckCheck } from 'lucide-react'

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
  notifications: NotifItem[]
  userId: string
  unreadCount: number
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth()    === date2.getMonth() &&
    date1.getDate()     === date2.getDate()
  )
}

export function NotificationsClient({ notifications, userId, unreadCount }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleMarkAll = () => {
    startTransition(async () => {
      await markAllNotificationsRead()
    })
  }

  const today     = new Date()
  const yesterday = new Date(today.getTime() - 86_400_000)

  const todayNotifs     = notifications.filter(n => isSameDay(new Date(n.created_at), today))
  const yesterdayNotifs = notifications.filter(n => isSameDay(new Date(n.created_at), yesterday))
  const olderNotifs     = notifications.filter(n => {
    const d = new Date(n.created_at)
    return !isSameDay(d, today) && !isSameDay(d, yesterday)
  })

  const groups = [
    { label: 'Hari ini',  items: todayNotifs },
    { label: 'Kemarin',   items: yesterdayNotifs },
    { label: 'Sebelumnya', items: olderNotifs },
  ].filter(g => g.items.length > 0)

  return (
    <>
      <NotificationsRealtimeListener userId={userId} />

      {/* Toolbar */}
      <div
        style={{
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          padding:       '14px 20px',
          borderBottom:  '1px solid #1a1a15',
          flexShrink:    0,
        }}
      >
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span
              className="font-code"
              style={{
                fontSize:     '10px',
                color:        '#c9504c',
                background:   'rgba(201,80,76,0.1)',
                padding:      '2px 8px',
                borderRadius: '10px',
              }}
            >
              {unreadCount} belum dibaca
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={isPending}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '5px',
              padding:    '6px 12px',
              borderRadius: '6px',
              border:     '1px solid #222220',
              background: 'transparent',
              color:      isPending ? '#3a3a32' : '#a09a8e',
              fontSize:   '11.5px',
              cursor:     isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            <CheckCheck size={12} />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div
            style={{
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              justifyContent:'center',
              padding:       '80px 20px',
              textAlign:     'center',
            }}
          >
            <div
              style={{
                width:          '48px',
                height:         '48px',
                borderRadius:   '50%',
                background:     'rgba(201,168,76,0.06)',
                border:         '1px solid rgba(201,168,76,0.15)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                marginBottom:   '14px',
                color:          '#3a3a32',
              }}
            >
              <Bell size={20} />
            </div>
            <p style={{ color: '#a09a8e', fontSize: '14px', fontFamily: 'Outfit, sans-serif', marginBottom: '4px' }}>
              Tidak ada notifikasi
            </p>
            <p
              className="font-code"
              style={{ color: '#3a3a32', fontSize: '11px' }}
            >
              Notifikasi akan muncul di sini
            </p>
          </div>
        ) : (
          groups.map(group => (
            <div key={group.label}>
              <div
                style={{
                  padding:       '10px 16px 6px',
                  background:    '#0c0c0a',
                  position:      'sticky',
                  top:           0,
                  zIndex:        1,
                }}
              >
                <span
                  className="font-code"
                  style={{
                    fontSize:      '10px',
                    color:         '#3a3a32',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {group.label}
                </span>
              </div>
              {group.items.map(notif => (
                <NotificationItem key={notif.id} notif={notif} />
              ))}
            </div>
          ))
        )}
      </div>
    </>
  )
}
