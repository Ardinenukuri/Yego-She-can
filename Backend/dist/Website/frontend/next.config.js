"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextConfig = {
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
exports.default = nextConfig;
