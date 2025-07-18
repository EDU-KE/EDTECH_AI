// Security headers configuration
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://www.gstatic.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https: blob:;
      media-src 'self';
      connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://firebase.googleapis.com https://*.google.com;
      frame-src 'self' https://last-35eb7.firebaseapp.com https://*.firebaseapp.com https://apis.google.com;
      worker-src 'self' blob:;
    `.replace(/\s+/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
