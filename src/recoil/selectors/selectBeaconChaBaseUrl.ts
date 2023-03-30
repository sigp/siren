import { selector } from 'recoil'
import { Network } from '../../constants/enums'
import { selectBnChain } from './selectBnChain'
import { BeaconChaValidatorUrl, GoerliBeaconChaValidatorUrl } from '../../constants/constants'

export const selectBeaconChaBaseUrl = selector({
  key: 'selectBeaconChaBaseUrl',
  get: ({ get }) => {
    return get(selectBnChain) === Network.Mainnet
      ? BeaconChaValidatorUrl
      : GoerliBeaconChaValidatorUrl
  },
})
