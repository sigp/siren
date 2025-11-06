import { NetworkId } from '../src/types'

const getBeaconChaLink = (networkId: NetworkId, path: string) => {
  const network = Number(networkId)

  if (network === NetworkId.SEPOLIA) {
    return `https://light-sepolia.beaconcha.in${path}`
  }

  const testnet =
    network === NetworkId.HOLESKY ? 'holesky.' : network === NetworkId.HOODI ? 'hoodi.' : ''
  return `https://${testnet}beaconcha.in${path}`
}

export default getBeaconChaLink
