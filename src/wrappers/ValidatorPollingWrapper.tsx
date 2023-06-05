import useValidatorInfoPolling from '../hooks/useValidatorInfoPolling'
import useValidatorCachePolling from '../hooks/useValidatorCachePolling'
import useValidatorMetrics from '../hooks/useValidatorMetrics'
import { FC, ReactElement, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { beaconNetworkError } from '../recoil/atoms'

export interface ValidatorPollingWrapperProps {
  children: ReactElement | ReactElement[]
}

const ValidatorPollingWrapper: FC<ValidatorPollingWrapperProps> = ({ children }) => {
  const [isReady, setReady] = useState(false)
  const isBn = useRecoilValue(beaconNetworkError)

  useValidatorInfoPolling({ isReady: isReady && !isBn })
  useValidatorCachePolling({ isReady: isReady && !isBn })
  useValidatorMetrics()

  useEffect(() => {
    setReady(true)
  }, [])

  return <>{children}</>
}

export default ValidatorPollingWrapper
