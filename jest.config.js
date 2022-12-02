// eslint-disable-next-line no-undef
module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+.(css|styl|less|gif|sass|scss|png|jpg|jpeg|svg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  testMatch: ['**/?(*.)+(spec).+(ts|tsx)'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node', 'ts', 'tsx'],
  setupFilesAfterEnv: ['./setup-test.ts'],
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.jest.json',
  //   },
  // },
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!src/**/*.d.ts',
    '!**/__stories__/**',
    '!**/__fixtures__/**',
  ],
  coverageThreshold: {
    global: {
      statements: 1,
      branches: 0.8,
      functions: 0.9,
      lines: 1.1,
    },
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/assetsTransformer.js',
  },
}
