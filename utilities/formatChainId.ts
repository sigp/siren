import { ChainId } from '../src/types'

const formatChainId = (id: string): ChainId => {
  switch (id) {
    case '17000':
      return ChainId.HOLESKY
    case '1':
      return ChainId.MAINNET
    case '7078815900':
      return ChainId.MEKONG
    default:
      return ChainId.LOCALTESTNET
  }
}

export default formatChainId
