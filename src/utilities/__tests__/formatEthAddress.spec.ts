import formatEthAddress from '../formatEthAddress'

describe('formatEthAddress', () => {
  it('should return default format', () => {
    expect(formatEthAddress('0x123456789101112131415')).toBe('0x1234...1415')
  })
  it('should return correct format', () => {
    expect(formatEthAddress('0x123456789101112131415', 8, 3)).toBe('0x123456...415')
  })
})
