/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dankbankbucket.s3.amazonaws.com',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
