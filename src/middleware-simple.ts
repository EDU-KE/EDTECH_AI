import { NextRequest, NextResponse } from 'next/server'

// Define protected routes and their required roles
const protectedRoutes = {
  // Student accessible routes
  '/dashboard': ['student', 'teacher', 'admin'],
  '/learning-tools': ['student', 'teacher', 'admin'],
  '/subjects': ['student', 'teacher', 'admin'],
  '/progress': ['student', 'teacher', 'admin'],
  '/activity': ['student', 'teacher', 'admin'],
  '/diary': ['student', 'teacher', 'admin'],
  '/recommendations': ['student', 'teacher', 'admin'],
  '/contests': ['student', 'teacher', 'admin'],
  '/leaderboard': ['student', 'teacher', 'admin'],
  '/library': ['student', 'teacher', 'admin'],
  '/exams': ['student', 'teacher', 'admin'],
  '/research': ['student', 'teacher', 'admin'],
  '/summarizer': ['student', 'teacher', 'admin'],
  '/tutor': ['student', 'teacher', 'admin'],
  '/chat': ['student', 'teacher', 'admin'],
  '/class': ['student', 'teacher', 'admin'],
  '/learning-path': ['student', 'teacher', 'admin'],
  '/career-path': ['student', 'teacher', 'admin'],
  
  // Teacher accessible routes
  '/students': ['teacher', 'admin'],
  '/tutors': ['teacher', 'admin'],
  '/tutor-tools': ['teacher', 'admin'],
  
  // Admin only routes
  '/admin': ['admin'],
} as const

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/signup',
  '/signin',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/404',
]

// API routes that should be protected
const protectedApiRoutes = {
  '/api/user': ['student', 'teacher', 'admin'],
  '/api/sessions': ['student', 'teacher', 'admin'],
  '/api/admin': ['admin'],
} as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Check for authentication token (we'll use a simple cookie-based auth for now)
  const authToken = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value as 'student' | 'teacher' | 'admin'
  const sessionExpiry = request.cookies.get('session-expiry')?.value

  // If no auth token, redirect to signin
  if (!authToken) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check if session has expired
  if (sessionExpiry) {
    const expiryTime = parseInt(sessionExpiry, 10)
    const now = Date.now()
    
    if (now > expiryTime) {
      // Session expired, clear cookies and redirect to signin
      const response = NextResponse.redirect(new URL('/signin', request.url))
      response.cookies.delete('auth-token')
      response.cookies.delete('user-role')
      response.cookies.delete('session-expiry')
      response.cookies.delete('auth-session')
      return response
    }
  }

  // Check API route protection
  if (pathname.startsWith('/api/')) {
    const apiRoute = Object.keys(protectedApiRoutes).find(route => 
      pathname.startsWith(route)
    ) as keyof typeof protectedApiRoutes

    if (apiRoute) {
      const allowedRoles = protectedApiRoutes[apiRoute]
      
      if (!userRole || !(allowedRoles as readonly string[]).includes(userRole)) {
        return new NextResponse(
          JSON.stringify({ error: 'Forbidden' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        )
      }
    }

    return NextResponse.next()
  }

  // Check page route protection
  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  ) as keyof typeof protectedRoutes

  if (protectedRoute) {
    const allowedRoles = protectedRoutes[protectedRoute]
    
    if (!userRole || !(allowedRoles as readonly string[]).includes(userRole)) {
      // Redirect based on user role
      const redirectUrl = userRole === 'admin' ? '/admin' : 
                         userRole === 'teacher' ? '/dashboard' : 
                         '/dashboard'
      
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "block-all-mixed-content",
    "upgrade-insecure-requests"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // HSTS (HTTP Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
