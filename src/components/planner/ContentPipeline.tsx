'use client'

import { PipelineCard } from './PipelineCard'

const COLUMNS = [
  { key: 'draft',         label: 'Draft',         color: '#5a5650' },
  { key: 'planned',       label: 'Planned',        color: '#c9904c' },
  { key: 'in_production', label: 'In Production',  color: '#4c7ac9' },
  { key: 'ready',         label: 'Ready',          color: '#c9a84c' },
  { key: 'published',     label: 'Published',      color: '#4caf7a' },
] as const

type ContentStatus = (typeof COLUMNS)[number]['key']

interface ContentCardItem {
  id: string
  title: string
  type: string
  target_platform: string
  status: string
  scheduled_date: string | null
  outlet: { slug: string; brand_color: string } | null
}

interface Props {
  cards: ContentCardItem[]
}

export function ContentPipeline({ cards }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '8px',
      }}
    >
      {COLUMNS.map((col) => {
        const colCards = cards.filter(c => c.status === col.key)

        return (
          <div key={col.key} style={{ minWidth: '200px' }}>
            {/* Column header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '8px 12px',
                marginBottom: '10px',
                background: '#141410',
                borderRadius: '8px',
                border: `1px solid ${col.color}25`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: col.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  className="font-code"
                  style={{ fontSize: '10px', color: col.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                >
                  {col.label}
                </span>
              </div>
              <span
                className="font-code"
                style={{
                  fontSize: '9px',
                  color: '#0c0c0a',
                  background: col.color,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                }}
              >
                {colCards.length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {colCards.length === 0 ? (
                <div
                  style={{
                    padding: '20px 12px',
                    textAlign: 'center',
                    border: '1px dashed #222220',
                    borderRadius: '8px',
                  }}
                >
                  <p className="font-code" style={{ fontSize: '10px', color: '#3a3a32' }}>
                    kosong
                  </p>
                </div>
              ) : (
                colCards.map(card => (
                  <PipelineCard
                    key={card.id}
                    card={card}
                    currentStatus={col.key as ContentStatus}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
