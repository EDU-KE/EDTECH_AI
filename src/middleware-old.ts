import { NextRequest, NextResponse } from 'next/server'

// Define protected routes and their required roles
const protectedRoutes = {
  // Student routes
  '/dashboard': ['student', 'teacher', 'admin'],
  '/learning-tools': ['student', 'teacher', 'admin'],
  '/progress': ['student', 'teacher', 'admin'],
  '/subjects': ['student', 'teacher', 'admin'],
  '/activity': ['student', 'teacher', 'admin'],
  '/diary': ['student', 'teacher', 'admin'],
  '/leaderboard': ['student', 'teacher', 'admin'],
  '/contests': ['student', 'teacher', 'admin'],
  '/exams': ['student', 'teacher', 'admin'],
  
  // Teacher routes
  '/tutor-tools': ['teacher', 'admin'],
  '/class': ['teacher', 'admin'],
  '/students': ['teacher', 'admin'],
  
  // Admin routes
  '/admin': ['admin'],
  
  // AI Features - available to all authenticated users
  '/tutor': ['student', 'teacher', 'admin'],
  '/summarizer': ['student', 'teacher', 'admin'],
  '/learning-path': ['student', 'teacher', 'admin'],
  '/research': ['student', 'teacher', 'admin'],
  '/career-path': ['student', 'teacher', 'admin'],
  '/library': ['student', 'teacher', 'admin'],
  '/chat': ['student', 'teacher', 'admin'],
  '/tutors': ['student', 'teacher', 'admin'],
  '/recommendations': ['student', 'teacher', 'admin']
}

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/contact',
  '/terms',
  '/privacy'
]

// Admin-only routes
const adminRoutes = [
  '/admin'
]

// Teacher and Admin routes
const teacherRoutes = [
  '/tutor-tools',
  '/class',
  '/students'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.deepseek.com https://firebaseapp.com https://*.firebaseapp.com https://firebase.googleapis.com; frame-ancestors 'none';"
  )

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return response
  }

  // Check if route requires authentication
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    // Allow access to unprotected routes
    return response
  }

  // Get auth tokens from cookies or headers
  const authToken = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value
  const sessionExpiry = request.cookies.get('session-expiry')?.value

  // Check if user is authenticated
  if (!authToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Check session expiry
  if (sessionExpiry) {
    const expiryTime = parseInt(sessionExpiry)
    const currentTime = Date.now()
    
    if (currentTime > expiryTime) {
      // Session expired, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('expired', 'true')
      url.searchParams.set('redirect', pathname)
      
      // Clear expired session cookies
      const response = NextResponse.redirect(url)
      response.cookies.delete('auth-token')
      response.cookies.delete('user-role')
      response.cookies.delete('session-expiry')
      return response
    }
  }

  // Check role-based access
  const requiredRoles = protectedRoutes[pathname as keyof typeof protectedRoutes]
  if (requiredRoles && userRole) {
    if (!requiredRoles.includes(userRole)) {
      // User doesn't have required role
      const url = request.nextUrl.clone()
      
      // Redirect based on user role
      if (userRole === 'student') {
        url.pathname = '/dashboard'
      } else if (userRole === 'teacher') {
        url.pathname = '/tutor-tools'
      } else if (userRole === 'admin') {
        url.pathname = '/admin'
      } else {
        url.pathname = '/dashboard'
      }
      
      return NextResponse.redirect(url)
    }
  }

  // Extend session if user is active
  if (authToken && sessionExpiry) {
    const currentTime = Date.now()
    const expiryTime = parseInt(sessionExpiry)
    const timeRemaining = expiryTime - currentTime
    
    // If less than 30 minutes remaining, extend session
    if (timeRemaining < 30 * 60 * 1000) {
      const newExpiry = currentTime + (24 * 60 * 60 * 1000) // 24 hours
      response.cookies.set('session-expiry', newExpiry.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
      })
    }
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
