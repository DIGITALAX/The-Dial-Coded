/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thedial.infura-ipfs.io",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "media.tenor.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lexica-serve-encoded-images.sharif.workers.dev/md",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    scrollRestoration: true,
    appDir: false,
    esmExternals: true,
  },
};

module.exports = nextConfig
