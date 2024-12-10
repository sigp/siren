import { NetworkId } from '../src/types'

const getEtherscanLink = (networkId: NetworkId, path: string) => {
  return `https://${networkId === NetworkId.HOLESKY ? 'holesky.' : ''}etherscan.io${path}`
}

export default getEtherscanLink
