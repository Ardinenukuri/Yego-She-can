import { NextConfig } from 'next';


const nextConfig: NextConfig = { 
  images: {
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
};

export default nextConfig;