import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { debounce } from '../../../utilities/debounce'
import { LogMetric, LogType } from '../../types'
import Input from '../Input/Input'
import LogStats from '../LogStats/LogStats'
import Spinner from '../Spinner/Spinner'
import { SSEContext } from '../SSELogProvider/SSELogProvider'
import Typography from '../Typography/Typography'
import LogRow from './LogRow'

export interface LogDisplayProps {
  type: LogType
  isLoading?: boolean
  priorityLogs: LogMetric
}

const LogDisplay: FC<LogDisplayProps> = React.memo(function ({ type, isLoading, priorityLogs }) {
  const { t } = useTranslation()
  const [searchText, setText] = useState('')
  const scrollableRef = useRef<HTMLDivElement | null>(null)

  const { beaconLogs, vcLogs } = useContext(SSEContext)

  const logs = useMemo(() => {
    return type === LogType.BEACON ? beaconLogs : vcLogs
  }, [type, beaconLogs, vcLogs])

  const { data } = logs

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    scrollableRef.current?.scrollTo({
      top: scrollableRef.current?.scrollHeight,
      behavior: 'smooth',
    })
  }

  const filteredLogs = useMemo(() => {
    const text = searchText.toLowerCase()
    return text
      ? data.filter((log) =>
          Object.values(log).some(
            (value) => value && value.toString().toLowerCase().includes(text),
          ),
        )
      : data
  }, [data, searchText])

  const onSearchText = debounce(500, (e: any) => {
    setText(e.target.value)
    setTimeout(() => scrollToBottom(), 500)
  })

  return (
    <div className='flex flex-1 flex-col lg:flex-row lg:overflow-hidden'>
      {isLoading ? (
        <div className='w-full h-full flex items-center justify-center'>
          <Spinner />
        </div>
      ) : (
        <>
          <div className='flex-1 flex group relative flex-col max-w-full md:max-w-1068 2xl:max-w-none max-h-396 lg:max-h-none mb-28 md:mb-0 mt-4 p-4 pb-0 border border-style500'>
            <i
              onClick={scrollToBottom}
              className='absolute bottom-5 right-5 text-primary text-4xl opacity-0 cursor-pointer group-hover:opacity-100 bi-arrow-down-circle-fill'
            />
            <div className='w-full flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between pb-6 border-b-style500'>
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
                  placeholder={t('logs.searchLogs')}
                  icon='bi-search'
                />
              </div>
            </div>
            {filteredLogs.length ? (
              <div ref={scrollableRef} className='flex-1 overflow-scroll scrollbar-hide'>
                <div className='table-auto w-full'>
                  {filteredLogs.map((log, index) => (
                    <LogRow key={index} log={log} />
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex-1 flex items-center justify-center'>
                <Typography type='text-caption1' isUpperCase>
                  {t('logs.noLogsFound')}
                </Typography>
              </div>
            )}
          </div>
          <div className='flex order-first lg:order-2 lg:max-w-xs w-full flex-col border-t-style500 border-l-style500 mt-4 lg:ml-4'>
            <LogStats
              critToolTip={t(
                `logs.tooltips.${type === LogType.BEACON ? 'beaconCritical' : 'validatorCritical'}`,
              )}
              errorToolTip={t(
                `logs.tooltips.${type === LogType.BEACON ? 'beaconError' : 'validatorError'}`,
              )}
              warnToolTip={t(
                `logs.tooltips.${type === LogType.BEACON ? 'beaconWarning' : 'validatorWarning'}`,
              )}
              size='lg'
              maxHeight='h-32 md:flex-1'
              maxWidth='w-full'
              metrics={priorityLogs}
            />
          </div>
        </>
      )}
    </div>
  )
})

LogDisplay.displayName = 'LogDisplay'

export default LogDisplay
