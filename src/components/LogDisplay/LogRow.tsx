import { LogLevels, SSELog } from '../../types'
import Typography from '../Typography/Typography'
import { FC, useState } from 'react'

export interface LogRowProps {
  log: SSELog
}

const LogRow: FC<LogRowProps> = ({ log }) => {
  const [isExpanded, setExpanded] = useState(false)
  const { level, time, msg } = log
  const levelColor =
    level === LogLevels.CRIT || level === LogLevels.ERRO
      ? 'text-error'
      : level === LogLevels.WARN
      ? 'text-warning'
      : LogLevels.INFO
      ? 'text-success'
      : undefined

  const remainingData = Object.keys(log)
    .filter((key) => !['level', 'msg', 'time'].includes(key))
    .map((key) => `${key}: ${log[key]} `)
    .join(', ')

  const formattedData = remainingData.slice(0, 250)
  const isLargeData = remainingData.length > 250

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <>
      <div
        onClick={toggleExpanded}
        className={`table-row hover:bg-dark50 dark:hover:bg-dark750 ${
          isLargeData ? (isExpanded ? 'cursor-row-resize' : 'cursor-nesw-resize') : 'cursor-default'
        }`}
      >
        <div className='lg:hidden table-cell px-4 py-2'>
          <Typography type='text-caption1' family='font-roboto'>
            {time}
            <span className={`${levelColor} pl-2`}>{level}</span>
          </Typography>
          <Typography type='text-caption1' family='font-roboto'>
            {msg}
          </Typography>
          <Typography type='text-caption1' className='break-all' family='font-roboto'>
            {`${isExpanded ? remainingData : formattedData}${
              isLargeData && !isExpanded ? '...' : ''
            }`}
          </Typography>
        </div>

        <div className='hidden lg:table-cell px-4 py-2 min-w-140'>
          <Typography type='text-caption1' family='font-roboto'>
            {time}
          </Typography>
        </div>
        <div className='hidden lg:table-cell p-2'>
          <Typography
            color={levelColor}
            darkMode={levelColor}
            type='text-caption1'
            family='font-roboto'
          >
            {level}
          </Typography>
        </div>
        <div className='hidden lg:table-cell px-4 py-2 min-w-150 max-w-150 xl:min-w-250 xl:max-w-250 2xl:max-w-none 2xl:min-w-320'>
          <Typography type='text-caption1' family='font-roboto'>
            {msg}
          </Typography>
        </div>
        <div className='hidden xl:table-cell px-4 py-2' />
        <div className='hidden xl:table-cell px-4 py-2' />
        <div className='hidden xl:table-cell px-4 py-2' />
        <div className='hidden lg:table-cell px-4 py-2'>
          <Typography type='text-caption1' className='break-all' family='font-roboto'>
            {`${isExpanded ? remainingData : formattedData}${
              isLargeData && !isExpanded ? '...' : ''
            }`}
          </Typography>
        </div>
      </div>
    </>
  )
}

export default LogRow
