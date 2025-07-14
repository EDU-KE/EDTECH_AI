import { NextRequest, NextResponse } from 'next/server'
import { URLSecurityValidator, SecurityHelpers } from './lib/security/url-protection'

// Define protected routes and their required roles
const protectedRoutes = {
  // Student accessible routes
  '/dashboard': ['student', 'teacher', 'admin'],
  '/profile': ['student', 'teacher', 'admin'],
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
  '/login',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/404',
  '/debug', // Allow debug page for troubleshooting
]

// API routes that should be protected
const protectedApiRoutes = {
  '/api/user': ['student', 'teacher', 'admin'],
  '/api/sessions': ['student', 'teacher', 'admin'],
  '/api/admin': ['admin'],
  '/api/auth': ['student', 'teacher', 'admin'], // Protect auth endpoints
} as const

// Enhanced security function to get client IP
function getClientIP(request: NextRequest): string {
  // Check various headers for real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = request.headers.get('x-client-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (clientIP) {
    return clientIP
  }
  
  // Fallback to connection remote address
  return request.ip || '127.0.0.1'
}
} as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Security: Block suspicious paths
  const suspiciousPaths = ['.env', '.git', 'wp-admin', 'phpmyadmin', '.well-known'];
  if (suspiciousPaths.some(path => pathname.includes(path))) {
    return new NextResponse('Not Found', { status: 404 });
  }
  
  // Allow public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Check if we're in demo mode (bypass authentication for demo mode)
  const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
                     process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here";

  // Check for authentication token (we'll use a simple cookie-based auth for now)
  const authToken = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value as 'student' | 'teacher' | 'admin'
  const sessionExpiry = request.cookies.get('session-expiry')?.value
  
  // In demo mode, restrict access
  if (isDemoMode) {
    console.log(`Demo mode: Checking access for ${pathname}`);
    
    // Demo mode: Block all API access
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Forbidden',
          message: 'Demo mode: API access is restricted. Please sign up for full access.' 
        }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
    
    // Demo mode: Only allow access to dashboard
    if (pathname !== '/dashboard') {
      console.log(`Demo mode: Access denied to ${pathname} - redirecting to dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    console.log(`Demo mode: Allowing access to dashboard`);
    // Add demo user context to headers for the application
    const response = NextResponse.next();
    response.headers.set('x-demo-mode', 'true');
    response.headers.set('x-demo-user-role', 'demo');
    response.headers.set('x-demo-restriction', 'dashboard-only');
    return response;
  }

  // If no auth token, redirect to login
  if (!authToken) {
    const signInUrl = new URL('/login', request.url)
    signInUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check if session has expired
  if (sessionExpiry) {
    const expiryTime = parseInt(sessionExpiry, 10)
    const now = Date.now()
    
    if (now > expiryTime) {
      // Session expired, clear cookies and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
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
          JSON.stringify({ 
            error: 'Forbidden',
            message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
          }),
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
  
  // Enhanced Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy - Enhanced
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https:",
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
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  // Add demo mode warning in development
  if (isDemoMode && process.env.NODE_ENV === 'development') {
    response.headers.set('X-Demo-Warning', 'This application is running in demo mode. Do not use in production.')
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
