import type { NextConfig } from 'next';

import type { NextConfig } from 'next';

import type { NextConfig } from 'next';

// Check for required DeepSeek API key at build time
if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
  throw new Error(`
    The DEEPSEEK_API_KEY environment variable is missing or empty.
    This is required for the AI features to work with DeepSeek.
    You can get a key from DeepSeek Platform and add it to a .env file:
    DEEPSEEK_API_KEY=your_deepseek_api_key_here
    
    Get your key from: https://platform.deepseek.com/api_keys
  `);
}

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
