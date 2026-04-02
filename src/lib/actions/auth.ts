'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

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

const GUEST_EMAIL = 'guest@easygoing.id'
const GUEST_PASSWORD = 'guest1234'

export async function signInAsGuest(
  _prevState: AuthState,
  _formData: FormData
): Promise<AuthState> {
  const service = createServiceClient()

  // Ensure guest user exists (idempotent)
  const { data: listData } = await service.auth.admin.listUsers()
  const guestUser = listData?.users?.find(u => u.email === GUEST_EMAIL)

  if (!guestUser) {
    // Create via admin API — trigger auto-creates profile + outlet assignment
    const { error: createErr } = await service.auth.admin.createUser({
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: 'Guest User' },
    })
    if (createErr) {
      return { error: 'Gagal membuat akun tamu.' }
    }
    // Update role to 'guest' (trigger defaults to 'staff_media')
    const { data: created } = await service.auth.admin.listUsers()
    const guest = created?.users?.find(u => u.email === GUEST_EMAIL)
    if (guest) {
      await service.from('profiles').update({ role: 'guest' }).eq('id', guest.id)
    }
  }

  // Sign in
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
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
