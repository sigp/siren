import React, { FC, ReactElement, createContext, useState, useEffect, useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import useSSEData, { defaultLogData } from '../../hooks/useSSEData'
import { beaconNetworkError, validatorNetworkError } from '../../recoil/atoms'
import { SSELog } from '../../types'

export interface SSELogWrapperProps {
  trigger?: number
  children: ReactElement | ReactElement[]
}

type logData = {
  data: SSELog[]
}

export const SSEContext = createContext<{
  beaconLogs: logData
  vcLogs: logData
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

const SSELogProvider: FC<SSELogWrapperProps> = React.memo(function ({ children, trigger = 10000 }) {
  const [, setTrigger] = useState(false)
  const setBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const setValidatorNetworkError = useSetRecoilState(validatorNetworkError)
  const [intervalId, setIntervalId] = useState<any | undefined>(undefined)
  const [isReady, setReady] = useState(false)

  useEffect(() => {
    if (intervalId) {
      setReady(true)
    }
  }, [intervalId, setReady])

  const clearRefreshInterval = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(undefined)
    }
  }, [intervalId, setIntervalId])

  const handleBeaconLogError = useCallback(() => {
    clearRefreshInterval()
    setBeaconNetworkError(true)
  }, [clearRefreshInterval, setBeaconNetworkError])

  const handleValidatorLogError = useCallback(() => {
    clearRefreshInterval()
    setValidatorNetworkError(true)
  }, [clearRefreshInterval, setValidatorNetworkError])

  const beaconLogs = useSSEData({ url: '/beacon-logs', onError: handleBeaconLogError, isReady })
  const validatorLogs = useSSEData({
    url: '/validator-logs',
    onError: handleValidatorLogError,
    isReady,
  })

  const triggerRefresh = useCallback(() => {
    setTrigger((prevTrigger) => !prevTrigger)
  }, [setTrigger])

  const startRefreshInterval = useCallback(() => {
    const interval = setInterval(() => {
      triggerRefresh()
    }, trigger as number)

    setTimeout(() => triggerRefresh(), trigger / 2)

    setIntervalId(interval)

    return interval
  }, [trigger, triggerRefresh, setIntervalId])

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        beaconLogs: beaconLogs as logData,
        vcLogs: validatorLogs as logData,
        intervalId,
        startRefreshInterval,
        clearRefreshInterval,
        triggerRefresh,
      }}
    >
      {children}
    </SSEContext.Provider>
  )
})

SSELogProvider.displayName = 'SSELogProvider'

export default SSELogProvider
