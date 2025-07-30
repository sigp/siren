/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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

    // Suppress source map warnings for third-party modules in development
    if (dev) {
      config.devtool = 'cheap-module-source-map'
    }

    return config
  },
}

module.exports = nextConfig
