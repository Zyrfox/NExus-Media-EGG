import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/shared/Topbar'
import { NotificationsClient } from '@/components/notifications/NotificationsClient'

type NotifRow = {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  copied_to_wa: boolean
  created_at: string
  related_task_id: string | null
}

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('notifications')
    .select('id, title, message, type, is_read, copied_to_wa, created_at, related_task_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  const notifications = (data ?? []) as NotifRow[]
  const unreadCount   = notifications.filter(n => !n.is_read).length

  return (
    <>
      <Topbar
        title="Notifikasi"
        crumb={unreadCount > 0 ? `${unreadCount} BELUM DIBACA` : 'SEMUA DIBACA'}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <NotificationsClient
          notifications={notifications}
          userId={user.id}
          unreadCount={unreadCount}
        />
      </div>
    </>
  )
}
