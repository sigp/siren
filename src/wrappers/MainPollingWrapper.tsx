import useValidatorInfoPolling from '../hooks/useValidatorInfoPolling'
import useValidatorHealthPolling from '../hooks/useValidatorHealthPolling'
import useBeaconHealthPolling from '../hooks/useBeaconHealthPolling'
import useValidatorPeerPolling from '../hooks/useValidatorPeerPolling'
import useValidatorCachePolling from '../hooks/useValidatorCachePolling'
import { FC, ReactElement, useEffect, useState } from 'react'

export interface MainPollingWrapperProps {
  children: ReactElement | ReactElement[]
}

const MainPollingWrapper: FC<MainPollingWrapperProps> = ({ children }) => {
  const [isReady, setReady] = useState(false)

  useValidatorInfoPolling({ isReady })
  useValidatorHealthPolling({ isReady })
  useBeaconHealthPolling({ isReady })
  useValidatorPeerPolling({ isReady })
  useValidatorCachePolling({ isReady })

  useEffect(() => {
    setReady(true)
  }, [])

  return <>{children}</>
}

export default MainPollingWrapper
