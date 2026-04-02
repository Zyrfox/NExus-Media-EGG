'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type TaskFormState = { error?: string; success?: boolean }

export async function createTask(
  _prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sesi habis. Silakan login ulang.' }

  const title = (formData.get('title') as string | null)?.trim()
  if (!title) return { error: 'Judul task wajib diisi.' }

  const category = formData.get('category') as string
  const outlet_id = formData.get('outlet_id') as string
  const assigned_to = (formData.get('assigned_to') as string | null) || null
  const priority = formData.get('priority') as string
  const due_date = (formData.get('due_date') as string | null) || null
  const description = (formData.get('description') as string | null)?.trim() || null

  const { error } = await supabase.from('tasks').insert({
    title,
    category,
    outlet_id,
    assigned_to: assigned_to || null,
    priority,
    due_date: due_date || null,
    description,
    status: 'draft',
    created_by: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath('/tasks')
  return { success: true }
}
