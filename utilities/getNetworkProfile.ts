export type NetworkKey =
  | 'mainnet'
  | 'hoodi'
  | 'holesky'
  | 'sepolia'
  | 'gnosis'
  | 'chiado'
  | 'testnet'
  | 'unknown'

export interface NetworkProfile {
  key: NetworkKey
  configName: string
  nativeSymbol: 'ETH' | 'GNO'
  coinbaseCurrency: 'ETH' | 'GNO'
  gweiDivisor: number
  pectraForkVersion: string | undefined
  isWriteSupported: boolean
  etherscan: { host: string } | null
  beaconcha: { host: string } | null
}

const warnedUnknownNames = new Set<string>()

const buildProfile = (configName: string): NetworkProfile => {
  switch (configName) {
    case 'mainnet':
      return {
        key: 'mainnet',
        configName,
        nativeSymbol: 'ETH',
        coinbaseCurrency: 'ETH',
        gweiDivisor: 1,
        pectraForkVersion: '0x05000000',
        isWriteSupported: true,
        etherscan: { host: 'etherscan.io' },
        beaconcha: { host: 'beaconcha.in' },
      }
    case 'holesky':
      return {
        key: 'holesky',
        configName,
        nativeSymbol: 'ETH',
        coinbaseCurrency: 'ETH',
        gweiDivisor: 1,
        pectraForkVersion: '0x06017000',
        isWriteSupported: true,
        etherscan: { host: 'holesky.etherscan.io' },
        beaconcha: { host: 'holesky.beaconcha.in' },
      }
    case 'hoodi':
      return {
        key: 'hoodi',
        configName,
        nativeSymbol: 'ETH',
        coinbaseCurrency: 'ETH',
        gweiDivisor: 1,
        pectraForkVersion: '0x60000910',
        isWriteSupported: true,
        etherscan: { host: 'hoodi.etherscan.io' },
        beaconcha: { host: 'hoodi.beaconcha.in' },
      }
    case 'sepolia':
      return {
        key: 'sepolia',
        configName,
        nativeSymbol: 'ETH',
        coinbaseCurrency: 'ETH',
        gweiDivisor: 1,
        pectraForkVersion: '0x90000074',
        isWriteSupported: true,
        etherscan: { host: 'sepolia.etherscan.io' },
        beaconcha: { host: 'light-sepolia.beaconcha.in' },
      }
    case 'gnosis':
      return {
        key: 'gnosis',
        configName,
        nativeSymbol: 'GNO',
        coinbaseCurrency: 'GNO',
        gweiDivisor: 32,
        pectraForkVersion: '0x05000064',
        isWriteSupported: false,
        etherscan: { host: 'gnosisscan.io' },
        beaconcha: { host: 'gnosischa.in' },
      }
    case 'chiado':
      return {
        key: 'chiado',
        configName,
        nativeSymbol: 'GNO',
        coinbaseCurrency: 'GNO',
        gweiDivisor: 32,
        pectraForkVersion: undefined,
        isWriteSupported: false,
        etherscan: { host: 'gnosis-chiado.blockscout.com' },
        beaconcha: null,
      }
    case 'testnet':
      return {
        key: 'testnet',
        configName,
        nativeSymbol: 'ETH',
        coinbaseCurrency: 'ETH',
        gweiDivisor: 1,
        pectraForkVersion: process.env.NEXT_PUBLIC_TESTNET_PECTRA_FORK_VERSION,
        isWriteSupported: true,
        etherscan: null,
        beaconcha: null,
      }
    default:
      return {
        key: 'unknown',
        configName,
        nativeSymbol: 'ETH',
        coinbaseCurrency: 'ETH',
        gweiDivisor: 1,
        pectraForkVersion: undefined,
        isWriteSupported: false,
        etherscan: null,
        beaconcha: null,
      }
  }
}

export const getNetworkProfile = (configName: string | undefined): NetworkProfile => {
  const normalized = (configName ?? '').toLowerCase()
  const profile = buildProfile(normalized)
  if (profile.key === 'unknown' && !warnedUnknownNames.has(normalized)) {
    warnedUnknownNames.add(normalized)
    // eslint-disable-next-line no-console
    console.warn('[getNetworkProfile] unknown CONFIG_NAME', configName)
  }
  return profile
}
