import useValidatorInfoPolling from '../hooks/useValidatorInfoPolling'
import useValidatorHealthPolling from '../hooks/useValidatorHealthPolling'
import useBeaconHealthPolling from '../hooks/useBeaconHealthPolling'
import useValidatorPeerPolling from '../hooks/useValidatorPeerPolling'
import useValidatorCachePolling from '../hooks/useValidatorCachePolling'
import { FC, ReactElement, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { beaconNetworkError, validatorNetworkError } from '../recoil/atoms'
import useExchangeRatePolling from '../hooks/useExchangeRatePolling'
import useProposerDutiesPolling from '../hooks/useProposerDutiesPolling'

export interface MainPollingWrapperProps {
  children: ReactElement | ReactElement[]
}

const MainPollingWrapper: FC<MainPollingWrapperProps> = ({ children }) => {
  const [isReady, setReady] = useState(false)
  const isBnModal = useRecoilValue(beaconNetworkError)
  const isVcModal = useRecoilValue(validatorNetworkError)

  useProposerDutiesPolling({ isReady })
  useExchangeRatePolling({ isReady })
  useValidatorInfoPolling({ isReady: isReady && !isBnModal })
  useValidatorHealthPolling({ isReady: isReady && !isVcModal })
  useBeaconHealthPolling({ isReady: isReady && !isBnModal })
  useValidatorPeerPolling({ isReady: isReady && !isBnModal })
  useValidatorCachePolling({ isReady: isReady && !isBnModal })

  useEffect(() => {
    setReady(true)
  }, [])

  return <>{children}</>
}

export default MainPollingWrapper
