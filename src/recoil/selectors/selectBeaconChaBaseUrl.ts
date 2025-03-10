import { selector } from 'recoil'
import {
  BeaconChaValidatorUrl,
  HoleskyBeaconChaValidatorUrl,
  KubernetsValidatorUrl,
} from '../../constants/constants'
import { Network } from '../../constants/enums'
import { selectBnChain } from './selectBnChain'

export const selectBeaconChaBaseUrl = selector({
  key: 'selectBeaconChaBaseUrl',
  get: ({ get }) => {
    const chain = get(selectBnChain)
    switch (chain) {
      case Network.Mainnet:
        return BeaconChaValidatorUrl
      case Network.Holesky:
        return HoleskyBeaconChaValidatorUrl
      default:
        return KubernetsValidatorUrl
    }
  },
})
