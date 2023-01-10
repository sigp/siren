import { selector } from 'recoil'
import { selectGenesisBlock } from './selectGenesisBlock'
import moment from 'moment'
import { secondsInSlot } from '../../constants/constants'

export const selectNextSlotDelay = selector({
  key: 'selectNextSlotDelay',
  get: async ({ get }) => {
    const genesisSlot = get(selectGenesisBlock)

    if (!genesisSlot) return

    const timeNow = moment().unix()
    const slot = Math.floor((timeNow - genesisSlot) / secondsInSlot)
    const slotTime = genesisSlot + slot * secondsInSlot
    const target = slotTime + secondsInSlot * 1.5

    return target - timeNow
  },
})
