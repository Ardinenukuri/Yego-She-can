import { NextConfig } from 'next';


const nextConfig: NextConfig = { 
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  allowedDevOrigins: ['http://192.168.43.229:3000'],
<<<<<<< HEAD
  output: 'standalone',
  typescript:{
    ignoreBuildErrors: true

  }
=======

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
>>>>>>> 641ce5d80a48408d3b2b76c2b6cce6b078275423
};

export default nextConfig;