import getTimeRemaining from '../getTimeRemaining'

describe('Get time remaining util', () => {
  it('should return correct times', () => {
    expect(getTimeRemaining(91810)).toStrictEqual({
      days: 1,
      hours: 1,
      minutes: 30,
      seconds: 10,
    })
  })
})
