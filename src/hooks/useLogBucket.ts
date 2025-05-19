import { useState, useMemo, useCallback } from 'react'
import { FormattedLogData } from '../types'

export function useLogBucket(initial?: FormattedLogData[]) {
  const [logMap, setLogMap] = useState<Map<number, FormattedLogData>>(() => {
    const m = new Map<number, FormattedLogData>()
    initial?.forEach((l) => m.set(l.id, l))
    return m
  })

  const appendLogs = useCallback((logs: FormattedLogData[]) => {
    setLogMap((prev) => {
      let changed = false
      const next = new Map(prev)
      for (const l of logs) {
        if (!next.has(l.id)) {
          next.set(l.id, l)
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [])

  const prependLogs = useCallback((logs: FormattedLogData[]) => {
    setLogMap((prev) => {
      let changed = false
      const next = new Map<number, FormattedLogData>()
      for (const l of logs) {
        if (!next.has(l.id)) {
          next.set(l.id, l)
          changed = true
        }
      }
      for (const [id, l] of prev.entries()) {
        if (!next.has(id)) next.set(id, l)
      }
      return changed ? next : prev
    })
  }, [])

  const resetLogs = useCallback(() => {
    setLogMap(new Map())
  }, [])

  const logBucket = useMemo(() => Array.from(logMap.values()), [logMap])

  return { logBucket, appendLogs, prependLogs, resetLogs }
}
