import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Standard client for user-facing operations.
 * Respects RLS and uses the Anon Key.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}

/**
 * Admin client for system-level operations (Sentinel OS).
 * Bypasses RLS using the Service Role Key.
 * USE WITH CAUTION.
 */
export async function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error('FATAL: SUPABASE_SERVICE_ROLE_KEY is missing. Admin operations cannot securely proceed.');
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      cookies: {
        getAll() { return [] },
        setAll() {}
      },
    }
  )
}
