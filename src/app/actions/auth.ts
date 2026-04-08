'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const username = formData.get('username') as string
  const phone = formData.get('phone') as string
  const referral_code = formData.get('referral_code') as string || null

  // --- UNIQUE PHONE CHECK ---
  const { data: existingPhone } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone', phone)
    .single()

  if (existingPhone) {
    return { error: 'Phone number already linked to an account. Please sign in instead.' }
  }
  // --------------------------

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/api/auth/callback`,
      data: {
        full_name,
        username,
        phone,
        referred_by_code: referral_code
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  
  const returnTo = formData.get('returnTo') as string
  
  // If email confirmation is disabled, 'data.session' will be present
  if (data.session) {
    redirect(returnTo || '/dashboard')
  } else {
    const loginUrl = returnTo ? `/login?message=Check your email to confirm your account&returnTo=${encodeURIComponent(returnTo)}` : '/login?message=Check your email to confirm your account'
    redirect(loginUrl)
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  
  const returnTo = formData.get('returnTo') as string
  redirect(returnTo || '/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Node unauthorized' }

  const full_name = formData.get('full_name') as string
  const username = formData.get('username') as string
  const phone = formData.get('phone') as string

  // Simple validation
  if (username && username.length < 3) return { error: 'Username must be at least 3 characters' }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name, 
      username, 
      phone 
    })
    .eq('id', user.id)

  if (error) {
    if (error.code === '23505') return { error: 'This username is already claimed by another node' }
    return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
