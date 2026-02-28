/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable server-side features for OAuth
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/clips',
        destination: '/clips/index.html',
      },
    ]
  },
};

module.exports = nextConfig;