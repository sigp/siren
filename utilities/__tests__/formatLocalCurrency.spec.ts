import { formatLocalCurrency } from '../formatLocalCurrency'

describe('formatLocalCurrency', () => {
  it('should return correct value with default params', () => {
    expect(formatLocalCurrency(120)).toBe('120.00')
  })
  it('should return correct value with optional params', () => {
    expect(formatLocalCurrency(120, { isStrict: true })).toBe('120')
    expect(formatLocalCurrency(120, { locale: 'de-DE' })).toBe('120,00')
    expect(formatLocalCurrency(120.12345678, { max: 4 })).toBe('120.1235')
    expect(formatLocalCurrency(120.1, { min: 3, max: 3 })).toBe('120.100')
  })
})
