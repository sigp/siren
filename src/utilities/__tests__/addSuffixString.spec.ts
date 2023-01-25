import addSuffixString from '../addSuffixString'

describe('addSuffixString util', () => {
  it('should return correct string', () => {
    expect(addSuffixString('test-string', 'GHz')).toBe('test-string GHz')
  })
})
