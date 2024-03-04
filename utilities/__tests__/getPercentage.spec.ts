import getPercentage from '../getPercentage'

describe('getPercentage', () => {
  it('should return correct value', () => {
    expect(getPercentage(25, 100)).toBe(25)
    expect(getPercentage(1, 1)).toBe(100)
    expect(getPercentage(2, 1)).toBe(200)
    expect(getPercentage(0, 0)).toBe(0)
  })
})
