/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["simple-peer-light", "trystero"],
};

module.exports = nextConfig
