import getRandBetween from '../getRandBetween'

describe('getRandBetween', () => {
  it('should return int between two values', () => {
    expect(getRandBetween(1, 10)).toBeGreaterThan(0)
    expect(getRandBetween(1, 10)).toBeLessThan(11)
  })
})
