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
        hostname: "media0.giphy.com",
        pathname: "/media/**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    scrollRestoration: true,
    appDir: false,
  },
};

module.exports = nextConfig;
