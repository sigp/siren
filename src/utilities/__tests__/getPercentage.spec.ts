import getPercentage from '../getPercentage'

describe('getPercentage', () => {
  it('should return correct value', () => {
    expect(getPercentage(25, 100)).toBe(25)
  })
})
