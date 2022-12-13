import formatBalanceColor from '../formatBalanceColor'

describe('formatBalanceColor util', () => {
  it('should return the correct text-color', () => {
    expect(formatBalanceColor(0)).toBe('text-dark500')
    expect(formatBalanceColor(50)).toBe('text-success')
    expect(formatBalanceColor(-25)).toBe('text-error')
  })
})
