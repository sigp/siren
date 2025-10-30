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

    // Configure output environment to support async/await modules
    config.output.environment = {
      ...config.output.environment,
      asyncFunction: true,
    }

    // Suppress the @chainsafe/bls async/await warning
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@chainsafe\/bls/,
        message: /async\/await/,
      },
    ]

    // Let Next.js handle devtool configuration for optimal performance
    // Overriding devtool can cause performance regressions

    return config
  },
}

module.exports = nextConfig
