/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // this replaces `next export`
  images: {
    unoptimized: true, // required when using next/image in static mode
  },
};

module.exports = nextConfig;