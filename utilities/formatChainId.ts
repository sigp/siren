import { ChainId } from '../src/types'

const formatChainId = (id: string): ChainId => {
  switch (id) {
    case '17000':
      return ChainId.HOLESKY
    case '1':
      return ChainId.MAINNET
    case '560048':
      return ChainId.HOODI
    case '11155111':
      return ChainId.SEPOLIA
    case '100':
      return ChainId.GNOSIS
    case '10200':
      return ChainId.CHIADO
    default:
      return ChainId.LOCALTESTNET
  }
}

export default formatChainId
