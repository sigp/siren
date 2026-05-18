import { getNetworkProfile } from '../getNetworkProfile'

describe('getNetworkProfile', () => {
  let warnSpy: jest.SpyInstance

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('returns mainnet profile', () => {
    const p = getNetworkProfile('mainnet')
    expect(p).toEqual({
      key: 'mainnet',
      configName: 'mainnet',
      nativeSymbol: 'ETH',
      coinbaseCurrency: 'ETH',
      gweiDivisor: 1,
      pectraForkVersion: '0x05000000',
      isWriteSupported: true,
      etherscan: { host: 'etherscan.io' },
      beaconcha: { host: 'beaconcha.in' },
    })
  })

  it('returns holesky profile', () => {
    const p = getNetworkProfile('holesky')
    expect(p).toEqual({
      key: 'holesky',
      configName: 'holesky',
      nativeSymbol: 'ETH',
      coinbaseCurrency: 'ETH',
      gweiDivisor: 1,
      pectraForkVersion: '0x06017000',
      isWriteSupported: true,
      etherscan: { host: 'holesky.etherscan.io' },
      beaconcha: { host: 'holesky.beaconcha.in' },
    })
  })

  it('returns hoodi profile', () => {
    const p = getNetworkProfile('hoodi')
    expect(p).toEqual({
      key: 'hoodi',
      configName: 'hoodi',
      nativeSymbol: 'ETH',
      coinbaseCurrency: 'ETH',
      gweiDivisor: 1,
      pectraForkVersion: '0x60000910',
      isWriteSupported: true,
      etherscan: { host: 'hoodi.etherscan.io' },
      beaconcha: { host: 'hoodi.beaconcha.in' },
    })
  })

  it('returns sepolia profile', () => {
    const p = getNetworkProfile('sepolia')
    expect(p).toEqual({
      key: 'sepolia',
      configName: 'sepolia',
      nativeSymbol: 'ETH',
      coinbaseCurrency: 'ETH',
      gweiDivisor: 1,
      pectraForkVersion: '0x90000074',
      isWriteSupported: true,
      etherscan: { host: 'sepolia.etherscan.io' },
      beaconcha: { host: 'light-sepolia.beaconcha.in' },
    })
  })

  it('returns gnosis profile', () => {
    const p = getNetworkProfile('gnosis')
    expect(p).toEqual({
      key: 'gnosis',
      configName: 'gnosis',
      nativeSymbol: 'GNO',
      coinbaseCurrency: 'GNO',
      gweiDivisor: 32,
      pectraForkVersion: '0x05000064',
      isWriteSupported: false,
      etherscan: { host: 'gnosisscan.io' },
      beaconcha: { host: 'gnosischa.in' },
    })
  })

  it('returns chiado profile', () => {
    const p = getNetworkProfile('chiado')
    expect(p).toEqual({
      key: 'chiado',
      configName: 'chiado',
      nativeSymbol: 'GNO',
      coinbaseCurrency: 'GNO',
      gweiDivisor: 32,
      pectraForkVersion: undefined,
      isWriteSupported: false,
      etherscan: { host: 'gnosis-chiado.blockscout.com' },
      beaconcha: null,
    })
  })

  it('returns testnet profile reading env var', () => {
    const prev = process.env.NEXT_PUBLIC_TESTNET_PECTRA_FORK_VERSION
    process.env.NEXT_PUBLIC_TESTNET_PECTRA_FORK_VERSION = '0xdeadbeef'
    const p = getNetworkProfile('testnet')
    expect(p).toEqual({
      key: 'testnet',
      configName: 'testnet',
      nativeSymbol: 'ETH',
      coinbaseCurrency: 'ETH',
      gweiDivisor: 1,
      pectraForkVersion: '0xdeadbeef',
      isWriteSupported: true,
      etherscan: null,
      beaconcha: null,
    })
    if (prev === undefined) delete process.env.NEXT_PUBLIC_TESTNET_PECTRA_FORK_VERSION
    else process.env.NEXT_PUBLIC_TESTNET_PECTRA_FORK_VERSION = prev
  })

  it('returns unknown profile for undefined', () => {
    const p = getNetworkProfile(undefined)
    expect(p.key).toBe('unknown')
    expect(p.isWriteSupported).toBe(false)
    expect(p.gweiDivisor).toBe(1)
  })

  it('returns unknown profile for unrecognized name', () => {
    const p = getNetworkProfile('fakenet')
    expect(p.key).toBe('unknown')
    expect(p.isWriteSupported).toBe(false)
    expect(p.gweiDivisor).toBe(1)
  })

  it('lowercases the CONFIG_NAME', () => {
    const p = getNetworkProfile('MAINNET')
    expect(p.key).toBe('mainnet')
    expect(p.configName).toBe('mainnet')
  })

  it('warns exactly once for repeated unknown CONFIG_NAME', () => {
    getNetworkProfile('repeated-unknown-name')
    getNetworkProfile('repeated-unknown-name')
    const calls = warnSpy.mock.calls.filter(
      ([msg]) => msg === '[getNetworkProfile] unknown CONFIG_NAME',
    )
    expect(calls).toHaveLength(1)
  })
})
