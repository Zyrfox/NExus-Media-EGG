import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NEXUS MEDIA — Easy Going Group',
  description: 'Internal media tracking platform for Easy Going Group',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" style={{ height: '100%' }}>
      <body style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </body>
    </html>
  )
}
