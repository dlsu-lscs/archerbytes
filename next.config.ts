import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    localPatterns: [
      {
        pathname: '/**',
      },
      {
        pathname: '/api/storage/profile-image',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      { protocol: 'https', hostname: 'cms.app.dlsu-lscs.org', pathname: '/**' },
      { protocol: 'https', hostname: 's3.api.dlsu-lscs.org', pathname: '/**' },
    ],
  },
};

export default nextConfig;
