import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            new URL('https://lh3.googleusercontent.com/a/**'),
            new URL('https://cms.app.dlsu-lscs.org/**'),
            new URL('https://s3.app.dlsu-lscs.org/**'),
        ],
    },
};

export default nextConfig;
