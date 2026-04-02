'use client'

import { useState } from 'react'
import { ContentPipeline } from './ContentPipeline'
import { IdeasBoard } from './IdeasBoard'
import { AddContentModal } from './AddContentModal'
import { AddIdeaModal } from './AddIdeaModal'
import { Plus, Layers, Lightbulb } from 'lucide-react'

interface ContentCardItem {
  id: string
  title: string
  type: string
  target_platform: string
  status: string
  scheduled_date: string | null
  outlet: { slug: string; brand_color: string } | null
}

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
  cards: ContentCardItem[]
  ideas: IdeaItem[]
}

type ActiveView = 'pipeline' | 'ideas'

export function PlannerClient({ cards, ideas }: Props) {
  const [view, setView]                   = useState<ActiveView>('pipeline')
  const [showAddContent, setShowAddContent] = useState(false)
  const [showAddIdea, setShowAddIdea]       = useState(false)

  const totalCards     = cards.length
  const totalPublished = cards.filter(c => c.status === 'published').length
  const totalIdeas     = ideas.length

  return (
    <>
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #1a1a15',
          background: '#0c0c0a',
          gap: '16px',
          flexShrink: 0,
        }}
      >
        {/* View tabs */}
        <div className="flex items-center gap-1" style={{ background: '#141410', borderRadius: '8px', padding: '3px' }}>
          <button
            onClick={() => setView('pipeline')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: view === 'pipeline' ? '#1a1a15' : 'transparent',
              color: view === 'pipeline' ? '#c9a84c' : '#5a5650',
              fontSize: '12px',
              fontFamily: 'Outfit, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Layers size={13} />
            Pipeline
          </button>
          <button
            onClick={() => setView('ideas')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: view === 'ideas' ? '#1a1a15' : 'transparent',
              color: view === 'ideas' ? '#c9a84c' : '#5a5650',
              fontSize: '12px',
              fontFamily: 'Outfit, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Lightbulb size={13} />
            Ideas Board
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4" style={{ flex: 1 }}>
          <Stat label="Total Konten" value={totalCards} color="#c9a84c" />
          <Stat label="Published"    value={totalPublished} color="#4caf7a" />
          <Stat label="Ideas"        value={totalIdeas} color="#4c7ac9" />
        </div>

        {/* Add button */}
        <button
          onClick={() => view === 'pipeline' ? setShowAddContent(true) : setShowAddIdea(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#c9a84c',
            color: '#0c0c0a',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            flexShrink: 0,
          }}
        >
          <Plus size={13} />
          {view === 'pipeline' ? 'Tambah Konten' : 'Tambah Ide'}
        </button>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {view === 'pipeline' ? (
          <ContentPipeline cards={cards} />
        ) : (
          <IdeasBoard ideas={ideas} />
        )}
      </div>

      {/* Modals */}
      {showAddContent && <AddContentModal onClose={() => setShowAddContent(false)} />}
      {showAddIdea    && <AddIdeaModal    onClose={() => setShowAddIdea(false)} />}
    </>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className="font-display" style={{ fontSize: '20px', fontWeight: 600, color, lineHeight: 1 }}>
        {value}
      </p>
      <p className="font-code" style={{ fontSize: '9px', color: '#3a3a32', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
        {label}
      </p>
    </div>
  )
}
