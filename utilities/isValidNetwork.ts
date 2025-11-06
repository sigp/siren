import { NetworkId } from '../src/types'

const isValidNetwork = (networkId: NetworkId): boolean => {
  const network = Number(networkId)

  return (
    network === NetworkId.HOLESKY ||
    network === NetworkId.MAINNET ||
    network === NetworkId.HOODI ||
    network === NetworkId.SEPOLIA
  )
}

export default isValidNetwork
