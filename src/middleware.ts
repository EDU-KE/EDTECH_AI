import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set CSP headers that allow Google and Firebase
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
  
  return response;
}

// Configure middleware to run on all paths
export const config = {
  matcher: '/:path*'
};
