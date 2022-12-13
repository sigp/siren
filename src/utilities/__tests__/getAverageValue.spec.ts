import getAverageValue from '../getAverageValue'

describe('getAverageValue', () => {
  it('should return correct value', () => {
    expect(getAverageValue([1, 1, 10, 10, 10, 10, 5, 5, 1, 1, 1])).toBe(5)
  })
})
