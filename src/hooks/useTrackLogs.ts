import useSSE from './useSSE'
import { LogLevels, SSELog } from '../types'
import { MutableRefObject, useRef } from 'react'
import moment from 'moment'
import { MAX_PERSISTED_LOGS } from '../constants/constants'

export type trackedLogData = {
  data: SSELog[]
  totalLogsPerHour: number
  criticalPerHour: number
  warningsPerHour: number
  errorsPerHour: number
  cleanLogs: () => void
}

export const defaultLogData = {
  data: [],
  totalLogsPerHour: 0,
  criticalPerHour: 0,
  warningsPerHour: 0,
  errorsPerHour: 0,
  cleanLogs: () => {},
}

const useTrackLogs = (url?: string): trackedLogData => {
  const dataRef = useRef<SSELog[]>([])
  const infoPerHour = useRef<number[]>([])
  const criticalPerHour = useRef<number[]>([])
  const warningsPerHour = useRef<number[]>([])
  const errorsPerHour = useRef<number[]>([])

  const incrementCounts = (log: SSELog) => {
    const { level } = log
    const timeNow = moment().unix()

    if (level === LogLevels.CRIT) {
      criticalPerHour.current.push(timeNow)
    }

    if (level === LogLevels.WARN) {
      warningsPerHour.current.push(timeNow)
    }

    if (level === LogLevels.ERRO) {
      errorsPerHour.current.push(timeNow)
    }

    if (level === LogLevels.INFO) {
      infoPerHour.current.push(timeNow)
    }
  }

  const trackLogs = (event: MessageEvent) => {
    let newData

    try {
      newData = JSON.parse(JSON.parse(event.data))
    } catch (e) {
      newData = JSON.parse(event.data) as SSELog
    }
    const newDataString = JSON.stringify(newData)

    const existingIndex = dataRef.current.findIndex(
      (data) => JSON.stringify(data) === newDataString,
    )

    if (existingIndex === -1) {
      incrementCounts(newData)
      if (dataRef.current.length >= MAX_PERSISTED_LOGS) {
        dataRef.current.shift()
      }
      dataRef.current.push(newData)
    }
  }

  const pruneLogRef = (ref: MutableRefObject<number[]>) => {
    while (ref.current.length > 0) {
      const elementTime = ref.current.shift()

      if (elementTime && moment().diff(moment.unix(elementTime), 'hours') <= 1) {
        ref.current.unshift(elementTime)
        break
      }
    }
  }

  const cleanLogs = () => {
    pruneLogRef(criticalPerHour)
    pruneLogRef(warningsPerHour)
    pruneLogRef(errorsPerHour)
    pruneLogRef(infoPerHour)
  }

  useSSE({ url, callback: trackLogs })

  const criticalCount = criticalPerHour.current.length
  const infoCount = infoPerHour.current.length
  const warningCount = warningsPerHour.current.length
  const errorCount = errorsPerHour.current.length

  const totalLogsPerHour = criticalCount + warningCount + errorCount + infoCount

  return {
    data: dataRef.current,
    totalLogsPerHour,
    criticalPerHour: criticalCount,
    warningsPerHour: warningCount,
    errorsPerHour: errorCount,
    cleanLogs,
  }
}

export default useTrackLogs
