import { SSELog, LighthouseLog } from '../types'

/**
 * Transforms the new Lighthouse log format to the expected SSELog format
 */
export function transformLighthouseLog(rawLog: LighthouseLog): SSELog {
  const { fields, level, target, time } = rawLog
  const { message, ...otherFields } = fields

  return {
    level,
    msg: message,
    service: target,
    time,
    ...otherFields,
  }
}

/**
 * Determines if log data is in the new Lighthouse format
 */
export function isLighthouseFormat(data: any): data is LighthouseLog {
  return (
    typeof data === 'object' &&
    data !== null &&
    'fields' in data &&
    'level' in data &&
    'target' in data &&
    'time' in data &&
    typeof data.fields === 'object' &&
    'message' in data.fields
  )
}

/**
 * Normalizes log data to SSELog format, handling both old and new formats
 */
export function normalizeLogData(rawData: any): SSELog {
  if (isLighthouseFormat(rawData)) {
    return transformLighthouseLog(rawData)
  }

  // Handle legacy format or already normalized data
  return rawData as SSELog
}
