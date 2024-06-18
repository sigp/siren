import { selector } from 'recoil'
import {
  BeaconChaValidatorUrl,
  HoleskyBeaconChaValidatorUrl
} from '../../constants/constants';
import { Network } from '../../constants/enums'
import { selectBnChain } from './selectBnChain'

export const selectBeaconChaBaseUrl = selector({
  key: 'selectBeaconChaBaseUrl',
  get: ({ get }) => {
    return get(selectBnChain) === Network.Mainnet
      ? BeaconChaValidatorUrl
      : HoleskyBeaconChaValidatorUrl
  },
})
