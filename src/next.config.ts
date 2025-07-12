import type { NextConfig } from 'next';

// Check for GOOGLE_API_KEY at build time
/*
if (!process.env.GOOGLE_API_KEY) {
  throw new Error(`
    The GOOGLE_API_KEY environment variable is missing or empty.
    This is required for the AI features to work.
    You can get a key from Google AI Studio and add it to a .env file:
    GOOGLE_API_KEY=your_google_api_key_here
  `);
}
*/

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
