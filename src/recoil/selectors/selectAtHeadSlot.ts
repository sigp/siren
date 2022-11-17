import { selector } from 'recoil'
import { selectBeaconSyncInfo } from './selectBeaconSyncInfo';
import { selectGenesisBlock } from './selectGenesisBlock';
import getAtHeadSlot from '../../utilities/getAtHeadSlot';

export const selectAtHeadSlot = selector<number | undefined>({
  key: 'SelectAtHeadSlot',
  get: ({ get }) => {
    const genesisTime = get(selectGenesisBlock)
    const {headSlot} = get(selectBeaconSyncInfo)

    return getAtHeadSlot(genesisTime, headSlot)
  },
})
