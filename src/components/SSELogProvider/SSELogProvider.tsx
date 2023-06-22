import useTrackLogs, { defaultLogData, trackedLogData } from '../../hooks/useTrackLogs'
import { FC, ReactElement, createContext, useState, useEffect, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { beaconNetworkError, validatorNetworkError, activeDevice } from '../../recoil/atoms'

export interface SSELogWrapperProps {
  trigger?: number
  children: ReactElement | ReactElement[]
}

export const SSEContext = createContext<{
  beaconLogs: trackedLogData
  vcLogs: trackedLogData
  intervalId: NodeJS.Timer | undefined
  clearRefreshInterval: () => void
  startRefreshInterval: () => void
  triggerRefresh: () => void
}>({
  beaconLogs: defaultLogData,
  vcLogs: defaultLogData,
  intervalId: undefined,
  clearRefreshInterval: () => {},
  startRefreshInterval: () => {},
  triggerRefresh: () => {},
})

const SSELogProvider: FC<SSELogWrapperProps> = ({ children, trigger = 10000 }) => {
  const [, setTrigger] = useState(false)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const setValidatorNetworkError = useSetRecoilState(validatorNetworkError)
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>(undefined)
  const { beaconUrl, validatorUrl } = useRecoilValue(activeDevice)

  const handleBeaconLogError = () => {
    clearRefreshInterval()
    setBeaconNetworkError(true)
  }

  const handleValidatorLogError = () => {
    clearRefreshInterval()
    setValidatorNetworkError(true)
  }

  const beaconLogs = useTrackLogs(`${beaconUrl}/lighthouse/logs`, handleBeaconLogError)
  const validatorLogs = useTrackLogs(`${validatorUrl}/logs`, handleValidatorLogError)

  const clearRefreshInterval = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(undefined)
    }
  }, [intervalId])

  const triggerRefresh = () => {
    beaconLogs.cleanLogs()
    validatorLogs.cleanLogs()
    setTrigger((prevTrigger) => !prevTrigger)
  }

  const startRefreshInterval = useCallback(() => {
    const interval = setInterval(() => {
      triggerRefresh()
    }, trigger)

    setIntervalId(interval)

    return interval
  }, [beaconLogs.cleanLogs, validatorLogs.cleanLogs, trigger])

  useEffect(() => {
    startRefreshInterval()
  }, [])

  useEffect(() => {
    return () => {
      clearRefreshInterval()
    }
  }, [clearRefreshInterval])

  return (
    <SSEContext.Provider
      value={{
        beaconLogs: beaconLogs,
        vcLogs: validatorLogs,
        intervalId,
        startRefreshInterval,
        clearRefreshInterval,
        triggerRefresh,
      }}
    >
      {children}
    </SSEContext.Provider>
  )
}

export default SSELogProvider
