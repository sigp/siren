import useBeaconSyncPolling from '../hooks/useBeaconSyncPolling'
import useValidatorSyncPolling from '../hooks/useValidatorSyncPolling'
import { FC, ReactElement, useEffect, useState } from 'react'

export interface SyncPollingWrapperProps {
  children: ReactElement | ReactElement[]
}

const SyncPollingWrapper: FC<SyncPollingWrapperProps> = ({ children }) => {
  const [isReady, setReady] = useState(false)

  useBeaconSyncPolling({ isReady })
  useValidatorSyncPolling({ isReady })

  useEffect(() => {
    setReady(true)
  }, [])

  return <>{children}</>
}

export default SyncPollingWrapper
