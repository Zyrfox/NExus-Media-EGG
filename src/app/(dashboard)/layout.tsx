import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/shared/Sidebar'
import type { Profile } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Verify session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*, outlet:outlets(*)')
    .eq('id', user.id)
    .single()

  if (!profileData) redirect('/login')

  const profile = profileData as Profile

  // Fetch unread notification count
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return (
    <div
      className="flex"
      style={{ height: '100vh', overflow: 'hidden', background: '#0c0c0a' }}
    >
      <Sidebar profile={profile} unreadCount={unreadCount ?? 0} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
