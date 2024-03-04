import formatEndpoint from '../formatEndpoint'
import { Protocol } from '../../src/constants/enums'

describe('format endpoint util', () => {
  it('should return the correct format', () => {
    expect(formatEndpoint({ protocol: Protocol.HTTP, port: 3000, address: 'localhost' })).toBe(
      'http://localhost:3000',
    )
    expect(
      formatEndpoint({ protocol: Protocol.HTTP, port: 3000, address: 'localhost/beacon' }),
    ).toBe('http://localhost:3000/beacon')
  })
  it('should return undefined if missing endpoint', () => {
    expect(formatEndpoint()).toBe(undefined)
  })
})
