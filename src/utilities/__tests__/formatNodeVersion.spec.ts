import formatNodeVersion from '../formatNodeVersion'

describe('formatNodeVersion', () => {
  it('should return correct value', () => {
    expect(formatNodeVersion('Lighthouse/v3.3.0-84392d6/aarch64-macos')).toStrictEqual({
      version: 'v3.3.0',
      id: '84392d6',
    })
  })
})
