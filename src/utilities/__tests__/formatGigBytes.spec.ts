import formatGigBytes from '../formatGigBytes'

describe('formatGigBytes', () => {
  it('should return correct gigabyte value', () => {
    expect(formatGigBytes(1073741824)).toBe(1)
    expect(formatGigBytes(2147483648)).toBe(2)
  })
})
