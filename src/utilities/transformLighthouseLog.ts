import { SSELog, LighthouseLog, LogLevels } from '../types'

// Normalizes Lighthouse log level to Siren's LogLevels
export function normalizeLogLevel(level: any): LogLevels {
  // Lighthouse sends 'ERROR' but Siren uses 'ERRO'
  if (level === 'ERROR') {
    return LogLevels.ERRO
  }

  // Return the level as-is if it's already a valid LogLevels value
  return level as LogLevels
}

/**
 * Transforms the new Lighthouse log format to the expected SSELog format
 */
export function transformLighthouseLog(rawLog: LighthouseLog): SSELog {
  const { fields, level, target, time } = rawLog
  const { message, ...otherFields } = fields

  return {
    level: normalizeLogLevel(level),
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
  const normalizedData = rawData as SSELog

  // Normalize the level if it exists
  if (normalizedData.level) {
    normalizedData.level = normalizeLogLevel(normalizedData.level)
  }

  return normalizedData
}
