import { NetworkId } from '../src/types'

const getBeaconChaLink = (networkId: NetworkId, path: string) => {
  const network = Number(networkId)
  const testnet =
    network === NetworkId.HOLESKY ? 'holesky.' : network === NetworkId.HOODI ? 'hoodi.' : ''
  return `https://${testnet}beaconcha.in${path}`
}

export default getBeaconChaLink
