'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type AuthState = { error: string }

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email atau password salah.' }
    }
    return { error: `Login gagal: ${error.message}` }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInAsGuest(
  _prevState: AuthState,
  _formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email:    'guest@easygoing.id',
    password: 'guest1234',
  })

  if (error) {
    return { error: 'Gagal masuk sebagai tamu.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
