import { selector } from 'recoil'
import { selectBnSpec } from './selectBnSpec'
import { Network } from '../../constants/enums'

export const selectBnChain = selector({
  key: 'selectBnChain',
  get: ({ get }) => {
    const specs = get(selectBnSpec)
    if (!specs) return

    const { DEPOSIT_CHAIN_ID } = specs

    switch (DEPOSIT_CHAIN_ID) {
      case '5':
        return Network.Goerli
      case '1':
        return Network.Mainnet
      case '4242':
        return Network.LocalTestnet
      default:
        return
    }
  },
})
