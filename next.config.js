/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
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

module.exports = removeImports(nextConfig);
