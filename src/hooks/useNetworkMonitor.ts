import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { beaconNetworkError, validatorNetworkError } from '../recoil/atoms'
import useSWRPolling from './useSWRPolling'

const useNetworkMonitor = () => {
  const [isBeaconError, setBeaconNetworkError] = useRecoilState(beaconNetworkError)
  const [isValidatorError, setValidatorNetworkError] = useRecoilState(validatorNetworkError)

  const notifyBnDisconnect = () => {
    setBeaconNetworkError(true)
  }

  const notifyValDisconnect = () => {
    setValidatorNetworkError(true)
  }

  // Monitor heartbeat endpoints with automatic recovery detection
  const { data: beaconData } = useSWRPolling(
    '/api/beacon-heartbeat',
    {
      refreshInterval: 6000,
      errorRetryCount: Infinity, // Keep retrying indefinitely
    },
    notifyBnDisconnect,
  )

  const { data: validatorData } = useSWRPolling(
    '/api/validator-heartbeat',
    {
      refreshInterval: 6000,
      errorRetryCount: Infinity, // Keep retrying indefinitely
    },
    notifyValDisconnect,
  )

  // Check if we got successful responses and clear error states immediately
  useEffect(() => {
    console.log('Beacon heartbeat data:', beaconData?.data, 'Error state:', isBeaconError)
    if (beaconData?.data === 'success' && isBeaconError) {
      console.log('Beacon node connection restored - clearing error state')
      setBeaconNetworkError(false)
    }
  }, [beaconData, isBeaconError, setBeaconNetworkError])

  useEffect(() => {
    console.log('Validator heartbeat data:', validatorData?.data, 'Error state:', isValidatorError)
    if (validatorData?.data === 'success' && isValidatorError) {
      console.log('Validator client connection restored - clearing error state')
      setValidatorNetworkError(false)
    }
  }, [validatorData, isValidatorError, setValidatorNetworkError])

  return {
    isBeaconError,
    isValidatorError,
  }
}

export default useNetworkMonitor
