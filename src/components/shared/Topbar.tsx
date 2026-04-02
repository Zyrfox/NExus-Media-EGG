'use client'

import { useState } from 'react'
import { Bell, Settings, Search } from 'lucide-react'
import type { Outlet, UserRole } from '@/types'

interface TopbarProps {
  title: string
  crumb?: string
  outlets?: Outlet[]
  activeOutletId?: string
  onOutletChange?: (outletId: string | null) => void
  unreadCount?: number
  userRole?: UserRole
}

export function Topbar({
  title,
  crumb,
  outlets = [],
  activeOutletId,
  onOutletChange,
  unreadCount = 0,
  userRole,
}: TopbarProps) {
  const [searchVal, setSearchVal] = useState('')

  const canSwitchOutlet = userRole === 'admin' || userRole === 'manager'

  return (
    <header
      className="flex items-center gap-3 flex-shrink-0"
      style={{
        height: '52px',
        padding: '0 24px',
        background: 'rgba(12,12,10,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #222220',
      }}
    >
      {/* Title */}
      <div>
        <h1
          className="font-display font-semibold"
          style={{ fontSize: '18px', color: '#e8e6df', letterSpacing: '0.03em', lineHeight: 1 }}
        >
          {title}
        </h1>
        {crumb && (
          <p
            className="font-code"
            style={{ fontSize: '10px', color: '#5a5650', letterSpacing: '0.06em', marginTop: '1px' }}
          >
            {crumb}
          </p>
        )}
      </div>

      {/* Outlet chips — manager/admin only */}
      {canSwitchOutlet && outlets.length > 0 && (
        <div className="flex gap-1 ml-3">
          <button
            onClick={() => onOutletChange?.(null)}
            className="font-code transition-all"
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '10.5px',
              fontWeight: 500,
              border: '1px solid transparent',
              cursor: 'pointer',
              fontFamily: 'DM Mono, monospace',
              background: !activeOutletId ? 'rgba(201,168,76,0.08)' : 'transparent',
              borderColor: !activeOutletId ? 'rgba(201,168,76,0.2)' : 'transparent',
              color: !activeOutletId ? '#c9a84c' : '#5a5650',
            }}
          >
            ALL
          </button>
          {outlets.map((outlet) => (
            <button
              key={outlet.id}
              onClick={() => onOutletChange?.(outlet.id)}
              className="font-code transition-all"
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '10.5px',
                fontWeight: 500,
                border: '1px solid transparent',
                cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
                background: activeOutletId === outlet.id ? 'rgba(201,168,76,0.08)' : 'transparent',
                borderColor: activeOutletId === outlet.id ? 'rgba(201,168,76,0.2)' : 'transparent',
                color: activeOutletId === outlet.id ? '#c9a84c' : '#5a5650',
              }}
            >
              {outlet.slug.toUpperCase().slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div
        className="flex items-center gap-2"
        style={{
          background: '#1a1a15',
          border: '1px solid #222220',
          borderRadius: '6px',
          padding: '6px 12px',
          width: '200px',
        }}
      >
        <Search size={12} style={{ color: '#5a5650', flexShrink: 0 }} />
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Cari..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e8e6df',
            fontSize: '11.5px',
            fontFamily: 'Outfit, sans-serif',
            width: '100%',
          }}
        />
      </div>

      {/* Notification bell */}
      <button
        className="relative flex items-center justify-center rounded-md transition-all"
        style={{
          width: '32px',
          height: '32px',
          background: '#1a1a15',
          border: '1px solid #222220',
          color: '#5a5650',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#2e2e28'
          e.currentTarget.style.color = '#a09a8e'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#222220'
          e.currentTarget.style.color = '#5a5650'
        }}
      >
        <Bell size={14} />
        {unreadCount > 0 && (
          <span
            className="absolute rounded-full"
            style={{
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              background: '#c9a84c',
              border: '1px solid #0c0c0a',
            }}
          />
        )}
      </button>

      {/* Settings */}
      <button
        className="flex items-center justify-center rounded-md transition-all"
        style={{
          width: '32px',
          height: '32px',
          background: '#1a1a15',
          border: '1px solid #222220',
          color: '#5a5650',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#2e2e28'
          e.currentTarget.style.color = '#a09a8e'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#222220'
          e.currentTarget.style.color = '#5a5650'
        }}
      >
        <Settings size={14} />
      </button>
    </header>
  )
}
