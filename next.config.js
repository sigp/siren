/** @type {import('next').NextConfig} */
const { execSync } = require('child_process')

const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_COMMIT_HASH: (() => {
      try {
        console.log('Attempting to get git commit hash...')
        console.log('Working directory:', process.cwd())
        const result = execSync('git rev-parse --short HEAD', { 
          cwd: process.cwd(),
          encoding: 'utf8' 
        }).trim()
        console.log('Git command successful, hash:', result)
        return result
      } catch (error) {
        console.error('Git command failed:', error.message)
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
