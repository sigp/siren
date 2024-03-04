import calculateAprPercentage from '../calculateAprPercentage'

describe('calculateAprPercentage', () => {
  it('should return correct percentage', () => {
    expect(calculateAprPercentage(34, 32)).toBe(6.25)
  })
})
