import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX_PERSISTED_LOGS } from '../constants/constants'
import { normalizeLogData } from '../utilities/transformLighthouseLog'

export type sseData<T extends unknown[]> = {
  data: T
}

export const defaultLogData = {
  data: [],
}

export type sseOptions = {
  url: string
  onError?: () => void
  onSuccess?: () => void
  isReady: boolean
  isStateStore?: boolean
}

const useSSEData = <T extends unknown[]>(options: sseOptions): sseData<T> => {
  const { url, onError, onSuccess, isReady, isStateStore } = options
  const [dataState, setDataState] = useState<T>([] as unknown as T)
  const dataRef = useRef<T>([] as unknown as T)
  const [reconnectTrigger, setReconnectTrigger] = useState(0)

  const updateData = useCallback(
    (event: MessageEvent) => {
      let rawData
      let newData

      try {
        rawData = JSON.parse(JSON.parse(event.data))
      } catch {
        try {
          rawData = JSON.parse(event.data)
        } catch {
          rawData = {}
        }
      }

      // Normalize log data to handle both old and new Lighthouse formats
      newData = normalizeLogData(rawData)

      const newDataString = JSON.stringify(newData)

      const updateDataArray = (dataArray: T): T => {
        if (dataArray.some((data) => JSON.stringify(data) === newDataString)) {
          return dataArray
        }

        const updatedData = [...dataArray, newData] as T
        if (updatedData.length > MAX_PERSISTED_LOGS) {
          updatedData.shift()
        }
        return updatedData
      }

      if (isStateStore) {
        setDataState(updateDataArray)
      } else {
        dataRef.current = updateDataArray(dataRef.current)
      }
    },
    [isStateStore],
  )

  const eventSourceRef = useRef<EventSource | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const errorCountRef = useRef<number>(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef<boolean>(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!url || !isReady) return

    const controller = new AbortController()
    controllerRef.current = controller

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => updateData(event)

    eventSource.onerror = () => {
      errorCountRef.current++

      if (errorCountRef.current >= 3) {
        eventSource.close()
        eventSourceRef.current = null
        onError?.()

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            errorCountRef.current = 0
            setReconnectTrigger((prev) => prev + 1)
          }
        }, 10000)
      }
    }

    eventSource.onopen = () => {
      errorCountRef.current = 0
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      onSuccess?.()
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
      controllerRef.current = null
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }
  }, [url, updateData, onError, onSuccess, isReady, reconnectTrigger])

  return {
    data: isStateStore ? dataState : dataRef.current,
  }
}

export default useSSEData
