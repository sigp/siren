const { execSync } = require('child_process')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_GIT_HASH: (() => {
      try {
        return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
      } catch (error) {
        console.warn('Could not get git hash:', error.message)
        return 'unknown'
      }
    })(),
  },
  webpack(config, { dev }) {
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
