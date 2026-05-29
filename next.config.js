/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [],
  },
  webpack: (config) => {
    // Fix for leaflet in Next.js
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;
