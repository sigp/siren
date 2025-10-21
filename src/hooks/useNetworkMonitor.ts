import { useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { MINIMUM_ERROR_DISPLAY_TIME, HEARTBEAT_POLLING_INTERVAL } from '../constants/constants'
import { beaconNetworkError, validatorNetworkError } from '../recoil/atoms'
import useSWRPolling from './useSWRPolling'

const useNetworkMonitor = () => {
  const [isBeaconError, setBeaconNetworkError] = useRecoilState(beaconNetworkError)
  const [isValidatorError, setValidatorNetworkError] = useRecoilState(validatorNetworkError)
  const beaconErrorTimestamp = useRef<number | null>(null)
  const validatorErrorTimestamp = useRef<number | null>(null)
  const beaconClearTimerRef = useRef<NodeJS.Timeout | null>(null)
  const validatorClearTimerRef = useRef<NodeJS.Timeout | null>(null)

  const notifyBnDisconnect = () => {
    if (!beaconErrorTimestamp.current) {
      beaconErrorTimestamp.current = Date.now()
    }
    if (beaconClearTimerRef.current) {
      clearTimeout(beaconClearTimerRef.current)
      beaconClearTimerRef.current = null
    }
    setBeaconNetworkError(true)
  }

  const notifyValDisconnect = () => {
    if (!validatorErrorTimestamp.current) {
      validatorErrorTimestamp.current = Date.now()
    }
    if (validatorClearTimerRef.current) {
      clearTimeout(validatorClearTimerRef.current)
      validatorClearTimerRef.current = null
    }
    setValidatorNetworkError(true)
  }

  // Monitor heartbeat endpoints with automatic recovery detection
  const { data: beaconData, lastSuccessTime: beaconLastSuccess } = useSWRPolling(
    '/api/beacon-heartbeat',
    {
      refreshInterval: HEARTBEAT_POLLING_INTERVAL,
      errorRetryCount: Infinity,
    },
    notifyBnDisconnect,
  )

  const { data: validatorData, lastSuccessTime: validatorLastSuccess } = useSWRPolling(
    '/api/validator-heartbeat',
    {
      refreshInterval: HEARTBEAT_POLLING_INTERVAL,
      errorRetryCount: Infinity,
    },
    notifyValDisconnect,
  )

  useEffect(() => {
    const hasSuccessData = beaconData?.data === 'success'
    const hasRecentSuccess =
      beaconLastSuccess &&
      beaconErrorTimestamp.current &&
      beaconLastSuccess > beaconErrorTimestamp.current

    if (hasSuccessData && hasRecentSuccess) {
      if (isBeaconError && beaconErrorTimestamp.current) {
        const errorDuration = Date.now() - beaconErrorTimestamp.current
        const remainingTime = Math.max(0, MINIMUM_ERROR_DISPLAY_TIME - errorDuration)

        if (beaconClearTimerRef.current) {
          clearTimeout(beaconClearTimerRef.current)
        }

        beaconClearTimerRef.current = setTimeout(() => {
          setBeaconNetworkError(false)
          beaconErrorTimestamp.current = null
          beaconClearTimerRef.current = null
        }, remainingTime)

        return () => {
          if (beaconClearTimerRef.current) {
            clearTimeout(beaconClearTimerRef.current)
          }
        }
      }
    }
  }, [beaconData, beaconLastSuccess, isBeaconError, setBeaconNetworkError])

  useEffect(() => {
    const hasSuccessData = validatorData?.data === 'success'
    const hasRecentSuccess =
      validatorLastSuccess &&
      validatorErrorTimestamp.current &&
      validatorLastSuccess > validatorErrorTimestamp.current

    if (hasSuccessData && hasRecentSuccess) {
      if (isValidatorError && validatorErrorTimestamp.current) {
        const errorDuration = Date.now() - validatorErrorTimestamp.current
        const remainingTime = Math.max(0, MINIMUM_ERROR_DISPLAY_TIME - errorDuration)

        if (validatorClearTimerRef.current) {
          clearTimeout(validatorClearTimerRef.current)
        }

        validatorClearTimerRef.current = setTimeout(() => {
          setValidatorNetworkError(false)
          validatorErrorTimestamp.current = null
          validatorClearTimerRef.current = null
        }, remainingTime)

        return () => {
          if (validatorClearTimerRef.current) {
            clearTimeout(validatorClearTimerRef.current)
          }
        }
      }
    }
  }, [validatorData, validatorLastSuccess, isValidatorError, setValidatorNetworkError])

  useEffect(() => {
    return () => {
      if (beaconClearTimerRef.current) {
        clearTimeout(beaconClearTimerRef.current)
      }
      if (validatorClearTimerRef.current) {
        clearTimeout(validatorClearTimerRef.current)
      }
    }
  }, [])

  return {
    isBeaconError,
    isValidatorError,
  }
}

export default useNetworkMonitor
