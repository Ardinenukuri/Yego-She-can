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
  output: 'standalone',
  eslint:{
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
};

export default nextConfig;