import formatHealthEndpoint from '../formatHealthEndpoint'
import { Protocol } from '../../constants/enums'

describe('formatHealthEndpoint', () => {
  it('should return valid health endpoint', () => {
    expect(
      formatHealthEndpoint({ protocol: Protocol.HTTP, address: '123.45.67', port: 8001 }),
    ).toBe('http://123.45.67:8001/lighthouse/ui/health')
    expect(
      formatHealthEndpoint({ protocol: Protocol.HTTPS, address: '876.54.32', port: 10001 }),
    ).toBe('https://876.54.32:10001/lighthouse/ui/health')
  })
})
