import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Synchronize the Auth Token (Refresh Session)
  // This validates the JWT and refreshes it if needed.
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  // 2. Enforce Authentication Guard
  // If the user attempts to reach a protected node without an authorized session,
  // we redirect them to the terminal login with a returnTo pointer.
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    
    // Clear existing params to avoid confusion, but preserve 'error' if it came from page level
    const currentError = url.searchParams.get('error')
    if (!currentError) {
       url.searchParams.set('error', 'Authorized session required.')
    }
    
    url.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(url)
  }

  // 3. Admin Access Protocol
  // We allow authenticated users to reach the admin page, where the page-level 
  // Identity Resolver will determine whether to load the console or show Restricted Access.
  // This ensures the "Access Restricted" screen is properly rendered instead of a raw redirect.
  
  return supabaseResponse
}
