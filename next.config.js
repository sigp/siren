/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    };

    return config
  },
}

module.exports = nextConfig
