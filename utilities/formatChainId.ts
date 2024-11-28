import { ChainId } from '../src/types'

const formatChainId = (id: string): ChainId => {
  switch (id) {
    case '17000':
      return ChainId.HOLESKY
    case '1':
      return ChainId.MAINNET
    default:
      return ChainId.LOCALTESTNET
  }
}

export default formatChainId
