import type { NextConfig } from 'next';

// Check for required DeepSeek API key at build time - warn but don't fail
if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
  console.warn(`
    Warning: The DEEPSEEK_API_KEY environment variable is missing or empty.
    AI features will not work without this key.
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
  // Allow cross-origin requests from codespace environment
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '*.preview.app.github.dev',
    '*.app.github.dev',
    '10.0.1.138',
  ],
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
