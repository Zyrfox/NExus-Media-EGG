import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
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

  // Fetch profile using service client to bypass RLS
  const service = createServiceClient()
  const { data: profileData } = await service
    .from('profiles')
    .select('*, outlet:outlets(*)')
    .eq('id', user.id)
    .single()

  if (!profileData) {
    // No profile = invalid account state → sign out to break redirect loop
    await supabase.auth.signOut()
    redirect('/login')
  }

  const profile = profileData as Profile

  // Fetch unread notification count using service client
  const { count: unreadCount } = await service
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
