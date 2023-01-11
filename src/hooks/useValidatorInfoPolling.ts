import { useRecoilState } from 'recoil'
import usePollingInterval from './usePollingInterval'
import { secondsInSlot } from '../constants/constants'
import { useEffect, useState } from 'react'
import { validatorInfoInterval } from '../recoil/atoms'
import useValidatorInfo from './useValidatorInfo'
import useNextSlotDelay from './useNextSlotDelay'

const useValidatorInfoPolling = () => {
  const [isReady, setReady] = useState(false)
  const [validatorInterval, setInterval] = useRecoilState(validatorInfoInterval)
  const isSkip = Boolean(validatorInterval) && isReady
  const { isDelayed } = useNextSlotDelay()

  const { fetchValidatorInfo } = useValidatorInfo()

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
