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
    if (!isLoading) {
      scrollToBottom()
    }
  }, [scrollableRef, isLoading])

  const scrollToBottom = () => {
    if (!scrollableRef.current) return

    scrollableRef.current.scrollTo({
      top: scrollableRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

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
    setTimeout(() => scrollToBottom(), 500)
  })

  return (
    <div className='flex flex-1 flex-col md:flex-row md:overflow-hidden'>
      {isLoading ? (
        <div className='w-full h-full flex items-center justify-center'>
          <Spinner />
        </div>
      ) : (
        <>
          <div className='flex-1 flex flex-col max-h-396 md:max-h-none mb-28 md:mb-0 mt-4 p-4 border border-style500'>
            <div className='flex group relative flex-col max-h-full flex-1'>
              <i
                onClick={scrollToBottom}
                className='absolute bottom-0 right-0 text-primary text-4xl opacity-0 cursor-pointer group-hover:opacity-100 bi-arrow-down-circle-fill'
              />
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
                  className='space-y-1 overflow-scroll scrollbar-hide flex-1'
                >
                  {filteredLogs.map(({ level, time, service, error, msg }, index) => {
                    const levelColor =
                      level === LogLevels.CRIT || level === LogLevels.ERRO
                        ? 'text-error'
                        : level === LogLevels.WARN
                        ? 'text-warning'
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
                              -- {level}:
                            </Typography>
                            <Typography
                              color={levelColor}
                              darkMode={levelColor}
                              type='text-caption1'
                              family='font-roboto'
                            >
                              {time}
                            </Typography>
                            <Typography className='pl-8' type='text-caption1' family='font-roboto'>
                              {msg}
                              {error ? ` --- ${error}` : ''}
                            </Typography>
                          </div>
                          <div className='flex justify-between space-x-2'>
                            <Typography type='text-caption1' family='font-roboto'>
                              SERVICE: <span className='uppercase'>{service || '-'}</span>
                            </Typography>
                          </div>
                        </div>
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
