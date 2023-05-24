import useTrackLogs, { defaultLogData, trackedLogData } from '../../hooks/useTrackLogs'
import { FC, ReactElement, createContext, useState, useEffect, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { selectBeaconUrl } from '../../recoil/selectors/selectBeaconUrl'
import { selectValidatorUrl } from '../../recoil/selectors/selectValidatorUrl'

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
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>(undefined)
  const beaconUrl = useRecoilValue(selectBeaconUrl)
  const validatorUrl = useRecoilValue(selectValidatorUrl)
  const beaconLogs = useTrackLogs(beaconUrl ? `${beaconUrl}/lighthouse/logs` : undefined)
  const validatorLogs = useTrackLogs(beaconUrl ? `${validatorUrl}/logs` : undefined)

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
