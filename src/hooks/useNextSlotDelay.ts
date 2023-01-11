import { selectGenesisBlock } from '../recoil/selectors/selectGenesisBlock'
import moment from 'moment/moment'
import { secondsInSlot } from '../constants/constants'
import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react'

const useNextSlotDelay = () => {
  const [isDelayed, toggleDelay] = useState(true)
  const genesisSlot = useRecoilValue(selectGenesisBlock) as number

  const timeNow = moment().unix()
  const slot = Math.floor((timeNow - genesisSlot) / secondsInSlot)
  const slotTime = genesisSlot + slot * secondsInSlot
  const target = slotTime + secondsInSlot * 1.5
  const delay = target - timeNow

  useEffect(() => {
    if (delay && isDelayed) {
      setTimeout(() => {
        toggleDelay(false)
      }, delay * 1000)
    }
  }, [delay, isDelayed])

  return {
    delay,
    isDelayed,
  }
}

export default useNextSlotDelay
