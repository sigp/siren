/** @type {import('next').NextConfig} */
const { execSync } = require('child_process')

const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_COMMIT_HASH: (() => {
      try {
        return execSync('git rev-parse --short HEAD').toString().trim()
      } catch (error) {
        return 'unknown'
      }
    })(),
  },
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

    // Let Next.js handle devtool configuration for optimal performance
    // Overriding devtool can cause performance regressions

    return config
  },
}

module.exports = nextConfig
