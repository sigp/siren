import { FC, ReactElement, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import useBeaconHealthPolling from '../hooks/useBeaconHealthPolling'
import useExchangeRatePolling from '../hooks/useExchangeRatePolling'
import useProposerDutiesPolling from '../hooks/useProposerDutiesPolling'
import useValidatorCachePolling from '../hooks/useValidatorCachePolling'
import useValidatorHealthPolling from '../hooks/useValidatorHealthPolling'
import useValidatorInfoPolling from '../hooks/useValidatorInfoPolling'
import useValidatorPeerPolling from '../hooks/useValidatorPeerPolling'
import { beaconNetworkError, validatorNetworkError } from '../recoil/atoms'

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
