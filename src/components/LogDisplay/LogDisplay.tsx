import { FC, useEffect, useMemo, useRef, useState } from 'react'
import Typography from '../Typography/Typography'
import { LogLevels, LogType } from '../../types'
import { trackedLogData } from '../../hooks/useTrackLogs'
import Spinner from '../Spinner/Spinner'
import Input from '../Input/Input'
import { debounce } from '../../utilities/debounce'
import LogStats from '../LogStats/LogStats'

export interface LogDisplayProps {
  type: LogType
  logs: trackedLogData
  isLoading?: boolean
}

const LogDisplay: FC<LogDisplayProps> = ({ type, logs, isLoading }) => {
  const [searchText, setText] = useState('')
  const scrollableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoading) {
      setText('')
    }
  }, [isLoading])

  useEffect(() => {
    if (scrollableRef.current && !isLoading) {
      scrollableRef.current.scrollTo({
        top: scrollableRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [scrollableRef, isLoading])

  const logCounts = useMemo(() => {
    const { totalLogsPerHour, errorsPerHour, criticalPerHour, warningsPerHour } = logs
    return {
      totalLogsPerHour,
      criticalPerHour,
      warningsPerHour,
      errorsPerHour,
    }
  }, [logs.totalLogsPerHour, logs.criticalPerHour, logs.warningsPerHour, logs.errorsPerHour])

  const filteredLogs = useMemo(() => {
    const text = searchText.toLowerCase()
    return logs.data.filter(
      ({ level, msg, service, error }) =>
        level?.toLowerCase().includes(text) ||
        msg?.toLowerCase().includes(text) ||
        service?.toLowerCase().includes(text) ||
        error?.toLowerCase().includes(text),
    )
  }, [logs, searchText])

  const onSearchText = debounce(500, (e: any) => {
    setText(e.target.value)
    setTimeout(() => {
      if (scrollableRef.current) {
        scrollableRef.current.scrollTo({
          top: scrollableRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 500)
  })

  return (
    <div className='flex flex-1 overflow-hidden'>
      {isLoading ? (
        <div className='w-full h-full flex items-center justify-center'>
          <Spinner />
        </div>
      ) : (
        <>
          <div className='flex-1 flex flex-col mt-4 p-4 border border-style500'>
            <div className='flex flex-col max-h-full flex-1'>
              <div className='w-full flex justify-between pb-6 border-b-style500'>
                <div className='w-fit space-y-2'>
                  <Typography className='w-fit' type='text-caption1' isUpperCase>
                    {type}
                  </Typography>
                  <hr className='w-full h-1' />
                </div>
                <div>
                  <Input
                    onChange={onSearchText}
                    className='h-8'
                    inputStyle='secondary'
                    placeholder='Search Logs'
                    icon='bi-search'
                  />
                </div>
              </div>
              {filteredLogs.length ? (
                <div
                  ref={scrollableRef}
                  className='space-y-6 overflow-scroll scrollbar-hide flex-1'
                >
                  {filteredLogs.map(({ level, time, service, error, msg }, index) => {
                    const levelColor =
                      level === LogLevels.CRIT || level === LogLevels.ERRO
                        ? 'text-error'
                        : undefined
                    return (
                      <div className='space-y-2 w-full' key={index}>
                        <div className='flex w-full justify-between'>
                          <div className='flex space-x-3'>
                            <Typography
                              type='text-caption1'
                              color={levelColor}
                              darkMode={levelColor}
                              family='font-roboto'
                            >
                              -- DEBUG-LEVEL {`< ${level} >`}
                            </Typography>
                            <Typography type='text-caption1' family='font-roboto'>
                              {time}
                            </Typography>
                            <Typography className='pl-8' type='text-caption1' family='font-roboto'>
                              Message: {msg}
                            </Typography>
                          </div>
                          <div className='flex justify-between space-x-2'>
                            <Typography type='text-caption1' family='font-roboto'>
                              SERVICE: <span className='uppercase'>{service || '-'}</span>
                            </Typography>
                          </div>
                        </div>
                        {error && (
                          <div className='flex space-x-8 pl-12'>
                            <Typography type='text-caption1' family='font-roboto'>
                              ERROR: {error || 'N/A'}
                            </Typography>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className='flex-1 flex items-center justify-center'>
                  <Typography type='text-caption1' isUpperCase>
                    No Logs Found
                  </Typography>
                </div>
              )}
            </div>
          </div>
          <div className='flex order-first md:order-2 w-full md:w-fit flex-col border-t-style500 border-l-style500 mt-4 md:ml-4'>
            <LogStats
              size='lg'
              maxHeight='h-32 md:flex-1'
              maxWidth='w-full'
              logCounts={logCounts}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default LogDisplay
