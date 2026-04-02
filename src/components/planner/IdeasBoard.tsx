'use client'

import { IdeaCard } from './IdeaCard'

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
  ideas: IdeaItem[]
}

export function IdeasBoard({ ideas }: Props) {
  if (ideas.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            fontSize: '20px',
          }}
        >
          💡
        </div>
        <p style={{ color: '#a09a8e', fontSize: '14px', fontFamily: 'Outfit, sans-serif', marginBottom: '4px' }}>
          Belum ada ide konten
        </p>
        <p className="font-code" style={{ color: '#3a3a32', fontSize: '11px' }}>
          Klik &quot;Tambah Ide&quot; untuk mulai brainstorm
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '12px',
      }}
    >
      {ideas.map(idea => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  )
}
