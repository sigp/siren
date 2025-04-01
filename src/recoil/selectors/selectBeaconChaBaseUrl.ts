import { selector } from 'recoil'
import {
  BeaconChaValidatorUrl,
  HoleskyBeaconChaValidatorUrl,
  HoodiBeaconChaValidatorUrl,
  KubernetsValidatorUrl,
} from '../../constants/constants'
import { ChainId } from '../../types'
import { selectBnChain } from './selectBnChain'

export const selectBeaconChaBaseUrl = selector({
  key: 'selectBeaconChaBaseUrl',
  get: ({ get }) => {
    const chain = get(selectBnChain)
    switch (chain) {
      case ChainId.MAINNET:
        return BeaconChaValidatorUrl
      case ChainId.HOLESKY:
        return HoleskyBeaconChaValidatorUrl
      case ChainId.HOODI:
        return HoodiBeaconChaValidatorUrl
      default:
        return KubernetsValidatorUrl
    }
  },
})
