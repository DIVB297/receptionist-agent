import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add headers for CORS to allow requests from ngrok and other origins
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // Disable the dev origin warning for ngrok
  experimental: {
    serverComponentsExternalPackages: ['fs'],
  },
};

export default nextConfig;
