import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        localPatterns: [
            { pathname: '/api/storage/**' },
            { pathname: '/**' },
        ],
        remotePatterns: [
            new URL('https://lh3.googleusercontent.com/a/**'),
            new URL('https://cms.app.dlsu-lscs.org/**'),
        ],
    },
};

export default nextConfig;
