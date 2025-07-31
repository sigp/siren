import { FC, useState } from 'react'
import { LogLevels, SSELog } from '../../types'

export interface LogRowProps {
  log: SSELog
}

// Enhanced service color mapping with improved visual distinction
const getServiceColor = (service: string): string => {
  const colorMap: Record<string, string> = {
    // Beacon node services - Blue tones
    lighthouse_beacon: 'text-blue-400 bg-blue-400/10',
    beacon_chain: 'text-cyan-400 bg-cyan-400/10',
    network: 'text-emerald-400 bg-emerald-400/10',
    sync: 'text-amber-400 bg-amber-400/10',
    execution: 'text-sky-400 bg-sky-400/10',

    // Validator services - Purple/Pink tones
    validator_services: 'text-purple-400 bg-purple-400/10',
    validator_client: 'text-violet-400 bg-violet-400/10',
    notifier_service: 'text-fuchsia-400 bg-fuchsia-400/10',
    duties_service: 'text-rose-400 bg-rose-400/10',
    block_service: 'text-teal-400 bg-teal-400/10',
    attestation: 'text-indigo-400 bg-indigo-400/10',

    // Common services - Gray/Neutral tones
    http_api: 'text-slate-400 bg-slate-400/10',
    database: 'text-red-400 bg-red-400/10',
    consensus: 'text-lime-400 bg-lime-400/10',
    discovery: 'text-orange-400 bg-orange-400/10',
  }

  // Find matching color or default
  const matchingKey = Object.keys(colorMap).find((key) => service.includes(key))
  return matchingKey ? colorMap[matchingKey] : 'text-gray-400 bg-gray-400/10'
}

// Format timestamp to be more readable without milliseconds
const formatTimestamp = (timeString: string): string => {
  try {
    // Handle different time formats from Lighthouse logs
    const cleanTime = timeString.replace(/\.\d{3}$/, '') // Remove milliseconds
    const date = new Date(cleanTime)

    if (isNaN(date.getTime())) {
      // Fallback for non-standard formats like "Jul 31 12:34:05"
      return timeString.replace(/\.\d{3}$/, '')
    }

    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch (error) {
    return timeString.replace(/\.\d{3}$/, '')
  }
}

const LogRow: FC<LogRowProps> = ({ log }) => {
  const [isExpanded, setExpanded] = useState(false)
  const { level, time, msg, service } = log

  const levelColor =
    level === LogLevels.CRIT || level === LogLevels.ERRO
      ? 'text-error'
      : level === LogLevels.WARN
        ? 'text-warning'
        : level === LogLevels.INFO
          ? 'text-success'
          : 'text-gray-400'

  const serviceColor = getServiceColor(service || '')
  const serviceName = service ? service.split('::').pop() || service : 'unknown'
  const formattedTime = formatTimestamp(time)

  // Better formatting for remaining data with emphasized field names
  const remainingDataElements = Object.keys(log)
    .filter((key) => !['level', 'msg', 'time', 'service'].includes(key))
    .map((key) => {
      const value = log[key]
      const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
      return { key, value: formattedValue }
    })

  const formatFieldsForDisplay = (
    fields: Array<{ key: string; value: string }>,
    isExpanded: boolean,
  ): string => {
    const displayFields = isExpanded ? fields : fields.slice(0, Math.min(fields.length, 5))
    return displayFields.map(({ key, value }) => `<strong>${key}:</strong> ${value}`).join(' • ')
  }

  const formattedFields = formatFieldsForDisplay(remainingDataElements, isExpanded)
  const hasFields = remainingDataElements.length > 0
  const isLargeData = remainingDataElements.length > 5

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <>
      <div
        onClick={toggleExpanded}
        className={`w-full hover:bg-dark50 dark:hover:bg-dark750 ${
          isLargeData ? (isExpanded ? 'cursor-row-resize' : 'cursor-nesw-resize') : 'cursor-default'
        }`}
      >
        <div className='lg:hidden table-cell px-3 py-1.5 space-y-0.5'>
          <div className='flex items-center gap-2 text-xs font-mono'>
            <span className='text-gray-500 dark:text-gray-400 min-w-[58px] text-xs'>
              {formattedTime}
            </span>
            <span className={`${levelColor} font-medium min-w-[40px] text-center text-xs`}>
              {level}
            </span>
            <span className={`${serviceColor} px-1.5 py-0.5 rounded text-xs font-medium truncate`}>
              {serviceName}
            </span>
          </div>
          <div className='text-xs font-roboto leading-tight text-gray-900 dark:text-gray-100'>
            {msg}
          </div>
          {hasFields && (
            <div
              className='text-xs break-words leading-tight text-gray-600 dark:text-gray-400 font-roboto'
              dangerouslySetInnerHTML={{
                __html: `${formattedFields}${isLargeData && !isExpanded ? ' <span class="text-gray-500">...</span>' : ''}`,
              }}
            />
          )}
        </div>

        <div className='hidden lg:table-cell px-3 py-1.5 w-[90px]'>
          <div className='text-xs font-mono text-gray-500 dark:text-gray-400'>{formattedTime}</div>
        </div>
        <div className='hidden lg:table-cell px-2 py-1.5 w-[50px] text-center'>
          <div className={`${levelColor} font-medium text-xs`}>{level}</div>
        </div>
        <div className='hidden lg:table-cell px-3 py-1.5 w-[180px] text-center'>
          <span
            className={`${serviceColor} px-1.5 py-0.5 rounded text-xs font-medium inline-block truncate max-w-full`}
            title={service}
          >
            {serviceName}
          </span>
        </div>
        <div className='hidden lg:table-cell px-3 py-1.5 w-auto min-w-[300px]'>
          <div className='text-xs font-roboto leading-tight text-gray-900 dark:text-gray-100'>
            {msg}
          </div>
        </div>
        <div className='hidden lg:table-cell px-3 py-1.5 w-auto'>
          {hasFields && (
            <div
              className='text-xs break-words leading-tight text-gray-600 dark:text-gray-400 font-roboto'
              dangerouslySetInnerHTML={{
                __html: `${formattedFields}${isLargeData && !isExpanded ? ' <span class="text-gray-500">...</span>' : ''}`,
              }}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default LogRow
