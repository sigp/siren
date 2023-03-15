import formatSemanticVersion from '../formatSemanticVersion'

describe('formatSemanticVersion util', () => {
  it('should return correct format', () => {
    expect(formatSemanticVersion('v3.5.1')).toStrictEqual({ major: 3, minor: 5, patch: 1 })
    expect(formatSemanticVersion('3.5.1')).toStrictEqual({ major: 3, minor: 5, patch: 1 })
    expect(formatSemanticVersion('r3.5.1')).toStrictEqual({ major: 3, minor: 5, patch: 1 })
    expect(formatSemanticVersion('version3.5.1')).toStrictEqual({ major: 3, minor: 5, patch: 1 })
  })

  it('should return undefined if invalid format', () => {
    expect(formatSemanticVersion('v.3.5.1')).toBe(undefined)
  })
})
