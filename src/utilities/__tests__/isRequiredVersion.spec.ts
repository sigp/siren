import isRequiredVersion from '../isRequiredVersion'

const mockRequiredVersion = {
  major: 3,
  minor: 5,
  patch: 0,
}

describe('isRequiredVersion', () => {
  it('should return true when passed correct semantic version', () => {
    expect(isRequiredVersion('Lighthouse/v3.5.1-319cc61/x86_64-linux', mockRequiredVersion)).toBe(
      true,
    )
    expect(isRequiredVersion('Lighthouse/v4.5.1-319cc61/x86_64-linux', mockRequiredVersion)).toBe(
      true,
    )
  })
  it('should return false when passed incorrect semantic version', () => {
    expect(isRequiredVersion('Lighthouse/v2.5.1-319cc61/x86_64-linux', mockRequiredVersion)).toBe(
      false,
    )
  })
})
