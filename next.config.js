/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // Enable top-level await support
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }

    return config
  },
}

module.exports = nextConfig
