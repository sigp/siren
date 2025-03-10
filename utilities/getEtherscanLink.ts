import { NetworkId } from '../src/types'

const getEtherscanLink = (networkId: NetworkId, path: string) => {
  return `https://${Number(networkId) === NetworkId.HOLESKY ? 'holesky.' : ''}etherscan.io${path}`
}

export default getEtherscanLink
