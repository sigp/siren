import useValidatorInfoPolling from '../hooks/useValidatorInfoPolling'
import useValidatorCachePolling from '../hooks/useValidatorCachePolling'
import useValidatorMetrics from '../hooks/useValidatorMetrics'
import { FC, ReactElement, useEffect, useState } from 'react'

export interface ValidatorPollingWrapperProps {
  children: ReactElement | ReactElement[]
}

const ValidatorPollingWrapper: FC<ValidatorPollingWrapperProps> = ({ children }) => {
  const [isReady, setReady] = useState(false)

  useValidatorInfoPolling({ isReady })
  useValidatorCachePolling({ isReady })
  useValidatorMetrics()

  useEffect(() => {
    setReady(true)
  }, [])

  return <>{children}</>
}

export default ValidatorPollingWrapper
