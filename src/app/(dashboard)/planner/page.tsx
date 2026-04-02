import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/shared/Topbar'
import { PlannerClient } from '@/components/planner/PlannerClient'

// ── Types ─────────────────────────────────────────────────────────────────────

type CardRow = {
  id: string
  title: string
  type: string
  target_platform: string
  status: string
  scheduled_date: string | null
  outlet: { slug: string; brand_color: string } | null
}

type IdeaRow = {
  id: string
  title: string
  description: string | null
  status: string
  votes: number
  idea_votes: { id: string }[]
  profiles: { full_name: string } | null
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PlannerPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [cardsRes, ideasRes] = await Promise.all([
    supabase
      .from('content_cards')
      .select('id, title, type, target_platform, status, scheduled_date, outlet:outlets(slug, brand_color)')
      .order('created_at', { ascending: false }),

    supabase
      .from('content_ideas')
      .select('id, title, description, status, votes, idea_votes(id), profiles!content_ideas_suggested_by_fkey(full_name)')
      .order('votes', { ascending: false }),
  ])

  const cards = (cardsRes.data ?? []) as unknown as CardRow[]
  const ideas = (ideasRes.data ?? []) as unknown as IdeaRow[]

  // Map ideas — mark which ones the current user has voted on
  const mappedIdeas = ideas.map(idea => ({
    id:          idea.id,
    title:       idea.title,
    description: idea.description,
    status:      idea.status,
    votes:       idea.votes,
    hasVoted:    user
      ? (idea.idea_votes ?? []).length > 0
      : false,
    suggestedBy: idea.profiles ? { full_name: idea.profiles.full_name } : null,
  }))

  const totalPublished = cards.filter(c => c.status === 'published').length

  return (
    <>
      <Topbar
        title="Content Planner"
        crumb={`${cards.length} KONTEN · ${totalPublished} PUBLISHED`}
      />
      <PlannerClient cards={cards} ideas={mappedIdeas} />
    </>
  )
}
