/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["simple-peer-light", "trystero", "ggpo"],
};

module.exports = nextConfig
