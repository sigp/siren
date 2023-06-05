import useBeaconSyncPolling from '../hooks/useBeaconSyncPolling'
import useValidatorSyncPolling from '../hooks/useValidatorSyncPolling'
import { FC, ReactElement, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { beaconNetworkError } from '../recoil/atoms'

export interface SyncPollingWrapperProps {
  children: ReactElement | ReactElement[]
}

const SyncPollingWrapper: FC<SyncPollingWrapperProps> = ({ children }) => {
  const [isReady, setReady] = useState(false)
  const isBnModal = useRecoilValue(beaconNetworkError)

  useBeaconSyncPolling({ isReady: isReady && !isBnModal })
  useValidatorSyncPolling({ isReady: isReady && !isBnModal })

  useEffect(() => {
    setReady(true)
  }, [])

  return <>{children}</>
}

export default SyncPollingWrapper
