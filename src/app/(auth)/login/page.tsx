'use client'

import { useActionState } from 'react'
import { signIn, type AuthState } from '@/lib/actions/auth'
import { Loader2 } from 'lucide-react'

const initialState: AuthState = { error: '' }

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(signIn, initialState)

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        background: '#0c0c0a',
        backgroundImage: `
          radial-gradient(ellipse 600px 400px at 70% 50%, rgba(201,168,76,0.04) 0%, transparent 70%),
          radial-gradient(ellipse 400px 600px at 20% 80%, rgba(76,122,201,0.03) 0%, transparent 60%)
        `,
      }}
    >
      {/* Login Box */}
      <div
        className="w-[400px] relative overflow-hidden"
        style={{
          background: '#141410',
          border: '1px solid #2e2e28',
          borderRadius: '12px',
          padding: '40px',
        }}
      >
        {/* Subtle gold corner glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)' }}
        />

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-content-center"
              style={{ background: '#c9a84c' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0c0c0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <span
              className="font-display font-semibold tracking-widest"
              style={{ fontSize: '18px', color: '#c9a84c', letterSpacing: '0.12em' }}
            >
              NEXUS <span style={{ color: '#a09a8e', fontWeight: 300 }}>MEDIA</span>
            </span>
          </div>
          <p
            className="font-code"
            style={{ fontSize: '10px', color: '#5a5650', letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            Easy Going Group · Internal Platform
          </p>
        </div>

        {/* Gold divider */}
        <div className="nx-divider mb-7" />

        {/* Form */}
        <form action={formAction} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1.5 font-code"
              style={{ fontSize: '10.5px', color: '#a09a8e', letterSpacing: '0.06em' }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nama@easygoinggroup.com"
              style={{
                width: '100%',
                background: '#1a1a15',
                border: '1px solid #222220',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#e8e6df',
                fontSize: '13px',
                fontFamily: 'Outfit, sans-serif',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.4)' }}
              onBlur={(e) => { e.target.style.borderColor = '#222220' }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1.5 font-code"
              style={{ fontSize: '10.5px', color: '#a09a8e', letterSpacing: '0.06em' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                background: '#1a1a15',
                border: '1px solid #222220',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#e8e6df',
                fontSize: '13px',
                fontFamily: 'Outfit, sans-serif',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.4)' }}
              onBlur={(e) => { e.target.style.borderColor = '#222220' }}
            />
          </div>

          {/* Error */}
          {state?.error && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-md"
              style={{ background: 'rgba(201,80,76,0.1)', border: '1px solid rgba(201,80,76,0.2)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9504c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: '12px', color: '#c9504c' }}>{state.error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full rounded-md font-semibold transition-all"
            style={{
              padding: '11px 16px',
              background: isPending ? 'rgba(201,168,76,0.6)' : '#c9a84c',
              color: '#0c0c0a',
              fontSize: '13px',
              fontFamily: 'Outfit, sans-serif',
              cursor: isPending ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Masuk...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        {/* Footer */}
        <p
          className="text-center mt-6 font-code"
          style={{ fontSize: '10px', color: '#3a3a32', letterSpacing: '0.06em' }}
        >
          NEXUS MEDIA v1.0 · Easy Going Group © 2026
        </p>
      </div>
    </div>
  )
}
