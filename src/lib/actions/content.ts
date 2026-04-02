'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ContentFormState = { error?: string; success?: boolean }

// ── Create content card ───────────────────────────────────────────────────────

export async function createContentCard(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sesi habis. Silakan login ulang.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('outlet_id')
    .eq('id', user.id)
    .single()

  if (!profile) return { error: 'Profil tidak ditemukan.' }

  const title           = (formData.get('title')           as string)?.trim()
  const type            = formData.get('type')            as string
  const target_platform = formData.get('target_platform') as string
  const scheduled_date  = formData.get('scheduled_date')  as string
  const description     = (formData.get('description')     as string)?.trim()

  if (!title) return { error: 'Judul konten wajib diisi.' }
  if (!type)  return { error: 'Tipe konten wajib dipilih.' }

  const { error } = await supabase.from('content_cards').insert({
    outlet_id:       profile.outlet_id,
    title,
    type,
    target_platform: target_platform || 'instagram',
    scheduled_date:  scheduled_date  || null,
    description:     description     || null,
    status:          'draft',
    created_by:      user.id,
  })

  if (error) return { error: `Gagal menyimpan: ${error.message}` }

  revalidatePath('/planner')
  return { success: true }
}

// ── Create content idea ───────────────────────────────────────────────────────

export async function createContentIdea(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sesi habis. Silakan login ulang.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('outlet_id')
    .eq('id', user.id)
    .single()

  if (!profile) return { error: 'Profil tidak ditemukan.' }

  const title       = (formData.get('title')       as string)?.trim()
  const description = (formData.get('description') as string)?.trim()

  if (!title) return { error: 'Judul ide wajib diisi.' }

  const { error } = await supabase.from('content_ideas').insert({
    outlet_id:    profile.outlet_id,
    title,
    description:  description || null,
    status:       'brainstorm',
    suggested_by: user.id,
  })

  if (error) return { error: `Gagal menyimpan: ${error.message}` }

  revalidatePath('/planner')
  return { success: true }
}

// ── Vote / unvote idea ────────────────────────────────────────────────────────

export async function voteContentIdea(ideaId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sesi habis.' }

  const { data: existing } = await supabase
    .from('idea_votes')
    .select('id')
    .eq('idea_id', ideaId)
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: idea } = await supabase
    .from('content_ideas')
    .select('votes')
    .eq('id', ideaId)
    .single()

  if (!idea) return { error: 'Ide tidak ditemukan.' }

  if (existing) {
    await supabase.from('idea_votes').delete().eq('id', existing.id)
    await supabase
      .from('content_ideas')
      .update({ votes: Math.max(0, idea.votes - 1) })
      .eq('id', ideaId)
  } else {
    const { error: voteErr } = await supabase
      .from('idea_votes')
      .insert({ idea_id: ideaId, user_id: user.id })
    if (!voteErr) {
      await supabase
        .from('content_ideas')
        .update({ votes: idea.votes + 1 })
        .eq('id', ideaId)
    }
  }

  revalidatePath('/planner')
  return {}
}

// ── Move content card to new status ──────────────────────────────────────────

const VALID_STATUSES = ['draft', 'planned', 'in_production', 'ready', 'published'] as const
type ContentStatus = (typeof VALID_STATUSES)[number]

export async function moveContentCard(
  cardId: string,
  newStatus: ContentStatus,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sesi habis.' }

  if (!VALID_STATUSES.includes(newStatus)) return { error: 'Status tidak valid.' }

  const update: Record<string, unknown> = { status: newStatus }
  if (newStatus === 'published') update.published_date = new Date().toISOString()

  const { error } = await supabase
    .from('content_cards')
    .update(update)
    .eq('id', cardId)

  if (error) return { error: error.message }

  revalidatePath('/planner')
  return {}
}
