import { useRecoilState, useRecoilValue } from 'recoil'
import usePollingInterval from './usePollingInterval'
import { secondsInSlot } from '../constants/constants'
import { useEffect, useState } from 'react'
import { validatorInfoInterval } from '../recoil/atoms'
import { selectNextSlotDelay } from '../recoil/selectors/selectNextSlotDelay'
import useValidatorInfo from './useValidatorInfo'

const useValidatorInfoPolling = () => {
  const [isReady, setReady] = useState(false)
  const [isDelayed, toggleDelay] = useState(true)
  const [validatorInterval, setInterval] = useRecoilState(validatorInfoInterval)
  const isSkip = Boolean(validatorInterval) && isReady
  const delayTime = useRecoilValue(selectNextSlotDelay)

  console.log(delayTime)

  const { fetchValidatorInfo } = useValidatorInfo()

  useEffect(() => {
    if (delayTime) {
      setTimeout(() => {
        toggleDelay(false)
      }, delayTime * 1000)
    }
  }, [delayTime])

  useEffect(() => {
    setReady(true)
  }, [])

  const onClearInterval = () => setInterval(undefined)

  const { intervalId } = usePollingInterval(fetchValidatorInfo, secondsInSlot * 1000, {
    isSkip: isSkip || isDelayed,
    onClearInterval,
  })

  useEffect(() => {
    if (intervalId) {
      setInterval(intervalId)
    }
  }, [intervalId])
}

export default useValidatorInfoPolling
