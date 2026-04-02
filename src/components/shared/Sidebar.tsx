'use client'

import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'
import type { Profile } from '@/types'
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Bell,
  Sparkles,
  FolderOpen,
  BookOpen,
  Users,
  LogOut,
} from 'lucide-react'

interface SidebarProps {
  profile: Profile
  unreadCount?: number
}

const NAV_ITEMS = [
  {
    section: 'WORKSPACE',
    items: [
      { id: 'dashboard', label: 'Dashboard',       icon: LayoutDashboard, href: '/',           roles: ['admin','manager','spv','staff_media','guest'] },
      { id: 'tasks',     label: 'Task Manager',    icon: CheckSquare,     href: '/tasks',      roles: ['admin','manager','spv','staff_media'] },
      { id: 'planner',   label: 'Content Planner', icon: CalendarDays,    href: '/planner',    roles: ['admin','manager','spv','staff_media'] },
    ],
  },
  {
    section: 'TOOLS',
    items: [
      { id: 'notif',  label: 'Notifikasi',      icon: Bell,       href: '/notifications', roles: ['admin','manager','spv','staff_media'] },
      { id: 'ai',     label: 'AI Cover',         icon: Sparkles,   href: '/ai-cover',      roles: ['admin','manager','spv','staff_media'] },
      { id: 'assets', label: 'Asset Database',  icon: FolderOpen, href: '/assets',         roles: ['admin','manager','spv','staff_media'] },
      { id: 'brand',  label: 'Brand Guideline', icon: BookOpen,   href: '/brand',          roles: ['admin','manager','spv','staff_media','guest'] },
    ],
  },
  {
    section: 'ADMIN',
    items: [
      { id: 'users', label: 'Kelola User', icon: Users, href: '/admin/users', roles: ['admin','manager'] },
    ],
  },
]

export function Sidebar({ profile, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const roleLabel: Record<string, string> = {
    admin:       'Admin',
    manager:     'Manager',
    spv:         'Supervisor',
    staff_media: 'Staff Media',
    guest:       'Guest',
  }

  return (
    <aside
      className="flex flex-col flex-shrink-0 overflow-hidden z-20"
      style={{
        width: '220px',
        background: '#141410',
        borderRight: '1px solid #222220',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4"
        style={{ padding: '20px 16px 16px', borderBottom: '1px solid #222220' }}
      >
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: '32px', height: '32px', background: '#c9a84c' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0c0c0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <span
          className="font-display font-semibold"
          style={{ fontSize: '16px', color: '#c9a84c', letterSpacing: '0.08em' }}
        >
          NEXUS <span style={{ color: '#a09a8e', fontWeight: 300 }}>MEDIA</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.roles.includes(profile.role)
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={section.section} style={{ paddingBottom: '4px' }}>
              <div
                className="font-code uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.14em',
                  color: '#3a3a32',
                  padding: '12px 16px 4px',
                }}
              >
                {section.section}
              </div>

              {visibleItems.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className="flex items-center gap-2.5 w-full text-left transition-all"
                    style={{
                      padding: '9px 16px',
                      fontSize: '12.5px',
                      fontWeight: 400,
                      fontFamily: 'Outfit, sans-serif',
                      color: active ? '#c9a84c' : '#5a5650',
                      background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                      borderLeft: `2px solid ${active ? '#c9a84c' : 'transparent'}`,
                      cursor: 'pointer',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = '#a09a8e'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = '#5a5650'
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <Icon size={14} style={{ opacity: active ? 1 : 0.7, flexShrink: 0 }} />
                    <span className="flex-1">{item.label}</span>
                    {item.id === 'notif' && unreadCount > 0 && (
                      <span
                        className="font-code"
                        style={{
                          fontSize: '9px',
                          background: 'rgba(201,80,76,0.1)',
                          color: '#c9504c',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontWeight: 500,
                        }}
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* User profile */}
      <div style={{ borderTop: '1px solid #222220', padding: '14px 16px' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center flex-shrink-0 font-display font-semibold rounded-full"
            style={{
              width: '32px',
              height: '32px',
              border: '1.5px solid #c9a84c',
              background: 'linear-gradient(135deg,#2e2510,#1a1610)',
              fontSize: '13px',
              color: '#c9a84c',
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="truncate"
              style={{ fontSize: '12px', color: '#e8e6df', fontWeight: 400 }}
            >
              {profile.full_name}
            </p>
            <p
              className="font-code truncate"
              style={{ fontSize: '10px', color: '#5a5650' }}
            >
              {roleLabel[profile.role] ?? profile.role}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              title="Keluar"
              className="flex items-center justify-center rounded transition-colors"
              style={{
                width: '24px',
                height: '24px',
                color: '#3a3a32',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c9504c' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#3a3a32' }}
            >
              <LogOut size={13} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
