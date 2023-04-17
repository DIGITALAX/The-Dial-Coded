/** @type {import('next').NextConfig} */

const allowedOrigins = [
  "https://api-mumbai.lens.dev",
  "https://thedial.infura-ipfs.io",
  "https://api.lens.dev",
  "https://lexica.art",
  "https://tenor.googleapis.com",
  "http://127.0.0.1:7860",
  "https://api.replicate.com/v1",
  "https://api.coingecko.com/api/v3",
  "https://thedial.xyz",
];

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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(","),
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
