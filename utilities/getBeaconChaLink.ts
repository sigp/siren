import { NetworkId } from '../src/types'

const getBeaconChaLink = (networkId: NetworkId, path: string) => {
  return `https://${networkId === NetworkId.HOLESKY ? 'holesky.' : ''}beaconcha.in${path}`
}

export default getBeaconChaLink
