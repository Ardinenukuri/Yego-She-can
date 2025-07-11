// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- ADD THIS 'images' CONFIGURATION BLOCK ---
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Specify the port of your backend
        pathname: '/uploads/**', // Allow any image from the 'uploads' folder
      },
    ],
  },
  // -----------------------------------------
};

export default nextConfig;