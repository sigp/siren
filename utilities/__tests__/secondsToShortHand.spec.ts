import secondsToShortHand from '../secondsToShortHand'

describe('Seconds to shorthand util', () => {
  it('should return zeros if out of time', () => {
    expect(secondsToShortHand(0)).toBe('0M 0S')
  })
  it('should return correct min and seconds', () => {
    expect(secondsToShortHand(100)).toBe('1M 40S')
  })
  it('should return correct hours and min', () => {
    expect(secondsToShortHand(5400)).toBe('1H 30M')
  })
  it('should return correct days and hours', () => {
    expect(secondsToShortHand(90000)).toBe('1D 1H')
  })
})
