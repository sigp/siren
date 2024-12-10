import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX_PERSISTED_LOGS } from '../constants/constants'

type AnyObject = { [key: string]: any }

export type sseData = {
  data: AnyObject[]
}

export const defaultLogData = {
  data: [],
}

export type sseOptions = {
  url: string
  onError?: () => void
  isReady: boolean
  isStateStore?: boolean
}

const useSSEData = (options: sseOptions): sseData => {
  const { url, onError, isReady, isStateStore } = options
  const [dataState, setDataState] = useState<AnyObject[]>([])
  const dataRef = useRef<AnyObject[]>([])

  const updateData = useCallback(
    (event: MessageEvent) => {
      let newData

      try {
        newData = JSON.parse(JSON.parse(event.data))
      } catch {
        try {
          newData = JSON.parse(event.data)
        } catch {
          console.log('error parsing data....')
          newData = {}
        }
      }

      const newDataString = JSON.stringify(newData)

      const updateDataArray = (dataArray: AnyObject[]): AnyObject[] => {
        if (dataArray.some((data) => JSON.stringify(data) === newDataString)) {
          return dataArray
        }

        const updatedData = [...dataArray, newData]
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

  useEffect(() => {
    if (!url || !isReady) return

    const controller = new AbortController()
    controllerRef.current = controller

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => updateData(event)

    eventSource.onerror = () => {
      if (errorCountRef.current++ >= 2) {
        controller.abort()
        eventSource.close()
        eventSourceRef.current = null
        onError?.()
      }
    }

    eventSource.onopen = () => {
      errorCountRef.current = 0
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
      controllerRef.current = null
    }
  }, [url, updateData, onError, isReady])

  return {
    data: isStateStore ? dataState : dataRef.current,
  }
}

export default useSSEData
