import { useEffect, useRef, useState } from 'react'

export interface MetricHistoryData {
  cpuHistory: number[]
  ramHistory: number[]
  diskHistory: number[]
  criticalLogsHistory: number[]
  errorLogsHistory: number[]
  warningLogsHistory: number[]
}

const useMetricHistory = (
  cpuUtilization: string,
  memoryUtilization: number,
  diskUtilization: number,
  criticalCount: number,
  errorCount: number,
  warningCount: number,
  maxDataPoints: number = 20,
): MetricHistoryData => {
  // Generate initial flat line data using current values for immediate display
  const generateInitialData = (currentValue: number) => {
    const points = Math.min(maxDataPoints, 10) // Start with 10 points
    const data: number[] = []

    // Create a flat line using the current value for all points
    for (let i = 0; i < points; i++) {
      data.push(currentValue)
    }
    return data
  }

  const [history, setHistory] = useState<MetricHistoryData>(() => ({
    cpuHistory: generateInitialData(parseFloat(cpuUtilization) || 0),
    ramHistory: generateInitialData(memoryUtilization || 0),
    diskHistory: generateInitialData(diskUtilization || 0),
    criticalLogsHistory: generateInitialData(criticalCount || 0),
    errorLogsHistory: generateInitialData(errorCount || 0),
    warningLogsHistory: generateInitialData(warningCount || 0),
  }))

  const lastUpdateRef = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    // Only update every 5 seconds to avoid too frequent updates
    if (now - lastUpdateRef.current < 5000) {
      return
    }

    lastUpdateRef.current = now

    setHistory((prev) => {
      const addDataPoint = (array: number[], newValue: number) => {
        const updated = [...array, newValue]
        return updated.length > maxDataPoints ? updated.slice(-maxDataPoints) : updated
      }

      return {
        cpuHistory: addDataPoint(prev.cpuHistory, parseFloat(cpuUtilization) || 0),
        ramHistory: addDataPoint(prev.ramHistory, memoryUtilization || 0),
        diskHistory: addDataPoint(prev.diskHistory, diskUtilization || 0),
        criticalLogsHistory: addDataPoint(prev.criticalLogsHistory, criticalCount || 0),
        errorLogsHistory: addDataPoint(prev.errorLogsHistory, errorCount || 0),
        warningLogsHistory: addDataPoint(prev.warningLogsHistory, warningCount || 0),
      }
    })
  }, [
    cpuUtilization,
    memoryUtilization,
    diskUtilization,
    criticalCount,
    errorCount,
    warningCount,
    maxDataPoints,
  ])

  return history
}

export default useMetricHistory
