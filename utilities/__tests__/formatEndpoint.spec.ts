import formatEndpoint from '../formatEndpoint'
import { Protocol } from '../../src/constants/enums'

describe('format endpoint util', () => {
  it('should return the correct format', () => {
    expect(formatEndpoint({ protocol: Protocol.HTTP, port: 3300, address: 'localhost' })).toBe(
      'http://localhost:3300',
    )
    expect(
      formatEndpoint({ protocol: Protocol.HTTP, port: 3300, address: 'localhost/beacon' }),
    ).toBe('http://localhost:3300/beacon')
  })
  it('should return undefined if missing endpoint', () => {
    expect(formatEndpoint()).toBe(undefined)
  })
})
