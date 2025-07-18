import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// CSP Headers for Firebase and Google Auth
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://apis.google.com',
    'https://*.firebaseapp.com',
    'https://*.googleapis.com',
    'https://www.gstatic.com'
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'media-src': ["'self'"],
  'connect-src': [
    "'self'",
    'https://*.firebaseapp.com',
    'https://*.googleapis.com',
    'https://firebase.googleapis.com',
    'https://*.google.com'
  ],
  'frame-src': [
    "'self'",
    'https://*.firebaseapp.com',
    'https://apis.google.com'
  ],
  'worker-src': ["'self'", 'blob:']
};

// Convert CSP object to string
const cspString = Object.entries(cspDirectives)
  .map(([key, values]) => `${key} ${values.join(' ')}`)
  .join('; ');

export async function middleware(request: NextRequest) {
  // Get response
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('Content-Security-Policy', cspString);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: '/:path*'
};
