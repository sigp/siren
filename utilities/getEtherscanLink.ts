import { NetworkId } from '../src/types'

const getEtherscanLink = (networkId: NetworkId, path: string) => {
  const network = Number(networkId)
  const testnet =
    network === NetworkId.HOLESKY
      ? 'holesky.'
      : network === NetworkId.HOODI
        ? 'hoodi.'
        : network === NetworkId.SEPOLIA
          ? 'sepolia.'
          : ''
  return `https://${testnet}etherscan.io${path}`
}

export default getEtherscanLink
