import { getNetworkProfile } from '../getNetworkProfile'
import { gweiToNative } from '../gweiToNative'

describe('gweiToNative', () => {
  const mainnetProfile = getNetworkProfile('mainnet')
  const gnosisProfile = getNetworkProfile('gnosis')

  it('converts 32 gwei→ETH for mainnet', () => {
    expect(gweiToNative('32000000000', mainnetProfile)).toBe(32)
  })

  it('converts 32 ETH worth of gwei to 1 GNO for gnosis (divide by 32)', () => {
    expect(gweiToNative('32000000000', gnosisProfile)).toBe(1)
  })

  it('handles zero input', () => {
    expect(gweiToNative(0, mainnetProfile)).toBe(0)
    expect(gweiToNative(0, gnosisProfile)).toBe(0)
  })

  it('handles bigint input', () => {
    expect(gweiToNative(BigInt('32000000000'), mainnetProfile)).toBe(32)
    expect(gweiToNative(BigInt('32000000000'), gnosisProfile)).toBe(1)
  })

  it('handles number input', () => {
    expect(gweiToNative(1_000_000_000, mainnetProfile)).toBe(1)
    expect(gweiToNative(32_000_000_000, gnosisProfile)).toBe(1)
  })

  it('handles string input', () => {
    expect(gweiToNative('1000000000', mainnetProfile)).toBe(1)
  })
})
