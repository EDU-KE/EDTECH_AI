import { NextRequest, NextResponse } from 'next/server'
import { URLSecurityValidator, SecurityHelpers } from './lib/security/url-protection'

// Helper function to validate domains
const isValidDomain = (hostname: string): boolean => {
  const validDomains = [
    'localhost',
    '127.0.0.1',
    'githubpreview.dev',
    'app.github.dev',
    'github.dev'
  ];
  
  return validDomains.some(domain => 
    hostname === domain || 
    hostname.endsWith(`.${domain}`) ||
    hostname.includes('-3000.') // Allow Codespace preview URLs
  );
}

import { NextRequest, NextResponse } from 'next/server';

// Basic middleware for CSP headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // CSP that allows Google and Firebase
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://*.googleapis.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://firebase.googleapis.com https://*.google.com",
    "frame-src 'self' https://*.firebaseapp.com https://apis.google.com",
    "worker-src 'self' blob:"
  ].join('; ');

  // Set security headers
  response.headers.set('Content-Security-Policy', csp);
  console.log('Middleware applied CSP headers');
  
  return response;
}

export const config = {
  matcher: '/:path*',
};
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://*.googleapis.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "media-src 'self'",
  "connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://firebase.googleapis.com https://*.google.com",
  "frame-src 'self' https://*.firebaseapp.com https://apis.google.com",
  "worker-src 'self' blob:"
].join('; ');

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
  
  // Fallback for local development
  return '127.0.0.1'
}

export async function middleware(request: NextRequest) {
  // Create base response
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Get the requested path
  const path = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || ''
  const clientIP = getClientIP(request)
  const isDev = process.env.NODE_ENV === 'development'
  
  // 🛡️ ADVANCED SECURITY VALIDATION
  
  // 1. Validate URL path for security threats
  const pathValidation = URLSecurityValidator.validatePath(pathname)
  if (!pathValidation.isValid) {
    SecurityHelpers.logSecurityEvent(
      `URL_THREAT_DETECTED: ${pathValidation.threats.join(', ')}`,
      clientIP,
      userAgent,
      pathname,
      { threats: pathValidation.threats, risk: pathValidation.risk }
    )
    
    // Block high-risk requests immediately
    if (pathValidation.risk === 'high') {
      return new NextResponse('Forbidden - Security threat detected', { 
        status: 403,
        headers: SecurityHelpers.getSecurityHeaders(isDev)
      })
    }
  }
  
  // 2. Validate query parameters
  const queryValidation = URLSecurityValidator.validateQueryParams(searchParams)
  if (!queryValidation.isValid) {
    SecurityHelpers.logSecurityEvent(
      `QUERY_THREAT_DETECTED: ${queryValidation.threats.join(', ')}`,
      clientIP,
      userAgent,
      pathname,
      { threats: queryValidation.threats }
    )
    
    return new NextResponse('Forbidden - Malicious query parameters', { 
      status: 403,
      headers: SecurityHelpers.getSecurityHeaders(isDev)
    })
  }
  
  // 3. Rate limiting
  const rateLimit = URLSecurityValidator.checkRateLimit(clientIP, 120, 60000) // 120 requests per minute
  if (!rateLimit.allowed) {
    SecurityHelpers.logSecurityEvent(
      'RATE_LIMIT_EXCEEDED',
      clientIP,
      userAgent,
      pathname,
      { resetTime: rateLimit.resetTime }
    )
    
    const response = new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        ...SecurityHelpers.getSecurityHeaders(isDev),
        'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
        'X-RateLimit-Limit': '120',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimit.resetTime.toString()
      }
    })
    return response
  }
  
  // 4. User agent validation
  const userAgentCheck = URLSecurityValidator.validateUserAgent(userAgent)
  if (userAgentCheck.isKnownBad) {
    SecurityHelpers.logSecurityEvent(
      'MALICIOUS_USER_AGENT',
      clientIP,
      userAgent,
      pathname,
      { category: userAgentCheck.category }
    )
    
    return new NextResponse('Forbidden', { 
      status: 403,
      headers: SecurityHelpers.getSecurityHeaders(isDev)
    })
  }
  
  // 5. IP validation
  const ipCheck = URLSecurityValidator.validateIP(clientIP)
  if (ipCheck.isSuspicious && !isDev) {
    SecurityHelpers.logSecurityEvent(
      'SUSPICIOUS_IP',
      clientIP,
      userAgent,
      pathname,
      { reason: ipCheck.reason }
    )
    
    // Log but don't block in case of false positives
    // return new NextResponse('Access Denied', { status: 403 })
  }
  
  // 6. Block known malicious paths
  const maliciousPaths = [
    '.env', '.git', 'wp-admin', 'phpmyadmin', 'admin.php', 'config.php',
    'backup', 'sql', 'database', 'db_backup', 'xmlrpc.php', 'login.php',
    'shell.php', 'cmd.php', 'eval.php', 'backdoor', 'c99', 'r57'
  ]
  
  if (maliciousPaths.some(path => pathname.toLowerCase().includes(path))) {
    SecurityHelpers.logSecurityEvent(
      'MALICIOUS_PATH_ACCESS',
      clientIP,
      userAgent,
      pathname
    )
    
    return new NextResponse('Not Found', { 
      status: 404,
      headers: SecurityHelpers.getSecurityHeaders(isDev)
    })
  }
  
  // 🔓 ALLOW STATIC FILES AND PUBLIC ROUTES
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon') || 
      pathname.includes('.') && !pathname.includes('..') ||
      publicRoutes.includes(pathname)) {
    
    const response = NextResponse.next()
    
    // Add security headers to all responses
    const securityHeaders = SecurityHelpers.getSecurityHeaders(isDev)
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '120')
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
    
    return response
  }

  // 🎭 DEMO MODE HANDLING
  const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
                     process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key_here"

  if (isDemoMode) {
    console.log(`Demo mode: Checking access for ${pathname}`)
    
    // Demo mode: Block API access except for specific endpoints
    if (pathname.startsWith('/api/')) {
      const allowedDemoApis = ['/api/demo', '/api/health']
      if (!allowedDemoApis.some(api => pathname.startsWith(api))) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Forbidden',
            message: 'Demo mode: API access is restricted. Please sign up for full access.',
            demo: true
          }),
          { 
            status: 403, 
            headers: { 
              'content-type': 'application/json',
              ...SecurityHelpers.getSecurityHeaders(isDev)
            } 
          }
        )
      }
    }
    
    // Demo mode: Redirect restricted pages to dashboard
    const allowedDemoPages = ['/dashboard', '/profile', '/debug']
    if (!allowedDemoPages.includes(pathname)) {
      console.log(`Demo mode: Access denied to ${pathname} - redirecting to dashboard`)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    console.log(`Demo mode: Allowing access to ${pathname}`)
    const response = NextResponse.next()
    
    // Add demo mode headers
    response.headers.set('x-demo-mode', 'true')
    response.headers.set('x-demo-user-role', 'demo')
    response.headers.set('x-demo-restriction', 'limited-access')
    
    // Add security headers
    const securityHeaders = SecurityHelpers.getSecurityHeaders(isDev)
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }

  // 🔐 AUTHENTICATION CHECK
  const authToken = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value as 'student' | 'teacher' | 'admin'
  const sessionExpiry = request.cookies.get('session-expiry')?.value
  
  // If no auth token, redirect to login with return URL
  if (!authToken) {
    SecurityHelpers.logSecurityEvent(
      'UNAUTHORIZED_ACCESS_ATTEMPT',
      clientIP,
      userAgent,
      pathname
    )
    
    const signInUrl = new URL('/login', request.url)
    signInUrl.searchParams.set('from', pathname)
    signInUrl.searchParams.set('reason', 'auth_required')
    return NextResponse.redirect(signInUrl)
  }

  // 🕐 SESSION EXPIRY CHECK
  if (sessionExpiry) {
    const expiryTime = parseInt(sessionExpiry, 10)
    const now = Date.now()
    
    if (now > expiryTime) {
      SecurityHelpers.logSecurityEvent(
        'SESSION_EXPIRED',
        clientIP,
        userAgent,
        pathname,
        { expiredAt: new Date(expiryTime).toISOString() }
      )
      
      // Session expired, clear cookies and redirect to login
      const response = NextResponse.redirect(new URL('/login?reason=session_expired', request.url))
      response.cookies.delete('auth-token')
      response.cookies.delete('user-role')
      response.cookies.delete('session-expiry')
      response.cookies.delete('auth-session')
      return response
    }
  }

  // 🔗 API ROUTE PROTECTION
  if (pathname.startsWith('/api/')) {
    const apiRoute = Object.keys(protectedApiRoutes).find(route => 
      pathname.startsWith(route)
    ) as keyof typeof protectedApiRoutes

    if (apiRoute) {
      const allowedRoles = protectedApiRoutes[apiRoute]
      
      if (!userRole || !(allowedRoles as readonly string[]).includes(userRole)) {
        SecurityHelpers.logSecurityEvent(
          'API_UNAUTHORIZED_ROLE_ACCESS',
          clientIP,
          userAgent,
          pathname,
          { userRole, requiredRoles: allowedRoles }
        )
        
        return new NextResponse(
          JSON.stringify({ 
            error: 'Forbidden',
            message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
            code: 'INSUFFICIENT_PERMISSIONS'
          }),
          { 
            status: 403, 
            headers: { 
              'content-type': 'application/json',
              ...SecurityHelpers.getSecurityHeaders(isDev)
            } 
          }
        )
      }
    }

    // Add security headers to API responses
    const response = NextResponse.next()
    const securityHeaders = SecurityHelpers.getSecurityHeaders(isDev)
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }

  // 🏠 PAGE ROUTE PROTECTION
  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  ) as keyof typeof protectedRoutes

  if (protectedRoute) {
    const allowedRoles = protectedRoutes[protectedRoute]
    
    if (!userRole || !(allowedRoles as readonly string[]).includes(userRole)) {
      SecurityHelpers.logSecurityEvent(
        'PAGE_UNAUTHORIZED_ROLE_ACCESS',
        clientIP,
        userAgent,
        pathname,
        { userRole, requiredRoles: allowedRoles }
      )
      
      // Redirect based on user role
      const redirectUrl = userRole === 'admin' ? '/admin' : 
                         userRole === 'teacher' ? '/dashboard' : 
                         '/dashboard'
      
      const redirectResponse = NextResponse.redirect(new URL(`${redirectUrl}?reason=insufficient_permissions`, request.url))
      
      // Add security headers
      const securityHeaders = SecurityHelpers.getSecurityHeaders(isDev)
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value)
      })
      
      return redirectResponse
    }
  }

  // ✅ ALL CHECKS PASSED - ADD SECURITY HEADERS AND PROCEED
  const response = NextResponse.next()
  
  // Add comprehensive security headers
  const securityHeaders = SecurityHelpers.getSecurityHeaders(isDev)
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add custom headers for authenticated requests
  response.headers.set('X-Authenticated', 'true')
  response.headers.set('X-User-Role', userRole || 'unknown')
  response.headers.set('X-Request-ID', crypto.randomUUID())
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '120')
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
  response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
  
  // Add timestamp for debugging
  response.headers.set('X-Request-Time', new Date().toISOString())
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - but we want to protect API routes too
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
