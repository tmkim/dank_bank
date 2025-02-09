import type { NextConfig } from 'next';

const nextConfig = {
  experimental: {
    appDir: true,
    turbo: false, // Disable Turbopack
  },
};

module.exports = nextConfig;
