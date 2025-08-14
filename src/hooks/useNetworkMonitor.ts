import { useRecoilState } from 'recoil'
import { beaconNetworkError, validatorNetworkError } from '../recoil/atoms'
import useSWRPolling from './useSWRPolling'

const useNetworkMonitor = () => {
  const [isBeaconError, setBeaconNetworkError] = useRecoilState(beaconNetworkError)
  const [isValidatorError, setValidatorNetworkError] = useRecoilState(validatorNetworkError)

  const notifyBnDisconnect = () => setBeaconNetworkError(true)
  const notifyValDisconnect = () => setValidatorNetworkError(true)

  // Retry connection when backend recovers
  const notifyBnReconnect = () => {
    if (isBeaconError) {
      console.log('Beacon node connection restored')
      setBeaconNetworkError(false)
    }
  }

  const notifyValReconnect = () => {
    if (isValidatorError) {
      console.log('Validator client connection restored')
      setValidatorNetworkError(false)
    }
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

  // Check if we got successful responses and clear error states
  if (beaconData && isBeaconError) {
    notifyBnReconnect()
  }

  if (validatorData && isValidatorError) {
    notifyValReconnect()
  }

  return {
    isBeaconError,
    isValidatorError,
  }
}

export default useNetworkMonitor
