import useValidatorInfoPolling from '../hooks/useValidatorInfoPolling'
import useValidatorCachePolling from '../hooks/useValidatorCachePolling'
import useValidatorMetrics from '../hooks/useValidatorMetrics'
import { FC, ReactElement, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { beaconNetworkError } from '../recoil/atoms'
import useExchangeRatePolling from '../hooks/useExchangeRatePolling'

export interface ValidatorPollingWrapperProps {
  children: ReactElement | ReactElement[]
}

const ValidatorPollingWrapper: FC<ValidatorPollingWrapperProps> = ({ children }) => {
  const [isReady, setReady] = useState(false)
  const isBn = useRecoilValue(beaconNetworkError)

  useExchangeRatePolling({ isReady })
  useValidatorInfoPolling({ isReady: isReady && !isBn })
  useValidatorCachePolling({ isReady: isReady && !isBn })
  useValidatorMetrics()

  useEffect(() => {
    setReady(true)
  }, [])

  return <>{children}</>
}

export default ValidatorPollingWrapper
