/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable server-side features for OAuth
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;