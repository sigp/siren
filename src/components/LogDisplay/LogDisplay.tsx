import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VirtuosoHandle } from 'react-virtuoso'
import { LOG_FETCH_LIMIT } from '../../constants/constants'
import { useLogBucket } from '../../hooks/useLogBucket'
import useStateDebounce from '../../hooks/useStateDebounce'
import { LogData, LogLevels, LogType, Metric } from '../../types'
import { normalizeLogData } from '../../utilities/transformLighthouseLog'
import Input from '../Input/Input'
import LoadingDots from '../LoadingDots/LoadingDots'
import LogStats from '../LogStats/LogStats'
import SelectDropDown, { OptionType } from '../SelectDropDown/SelectDropDown'
import Spinner from '../Spinner/Spinner'
import { SSEContext } from '../SSELogProvider/SSELogProvider'
import Typography from '../Typography/Typography'
import VirtualLogList from './VirtualLogList'

export interface LogDisplayProps {
  type: LogType
  isLoading?: boolean
  metrics: Metric
}

const LogDisplay: FC<LogDisplayProps> = React.memo(function ({ type, isLoading, metrics }) {
  const { t } = useTranslation()
  const defaultSelection = { title: 'ALL', value: 'ALL' }
  const { logBucket, prependLogs, appendLogs, resetLogs } = useLogBucket()
  const [isInitialHistoryLoading, setIsInitialHistoryLoading] = useState(true)
  const [isHistoryFetching, setIsHistoryFetching] = useState(false)
  const [levelSelection, setLevelSelection] = useState<OptionType>(defaultSelection.value)
  const [searchText, setSearchText] = useState('')
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const counterRef = useRef<number>(0) // Counter for logs within the same millisecond
  const { beaconLogs, vcLogs } = useContext(SSEContext)
  const incomingLogs = type === LogType.BEACON ? beaconLogs?.data ?? [] : vcLogs?.data ?? []
  const levelOptions = [
    defaultSelection,
    { title: LogLevels.INFO, value: LogLevels.INFO },
    { title: LogLevels.WARN, value: LogLevels.WARN },
    { title: LogLevels.ERRO, value: LogLevels.ERRO },
    { title: LogLevels.CRIT, value: LogLevels.CRIT },
  ]

  const debouncedSearchText = useStateDebounce(searchText, 500)
  const isSearchView = debouncedSearchText.length >= 3

  const generateUniqueId = useCallback(() => {
    const timestamp = Date.now()
    const counter = counterRef.current++
    const random = Math.floor(Math.random() * 1000)

    return Number(
      `${timestamp}${counter.toString().padStart(3, '0')}${random.toString().padStart(3, '0')}`,
    )
  }, [])

  const mappedIncoming = useMemo(() => {
    const logs =
      levelSelection !== defaultSelection.value
        ? incomingLogs.filter(({ level }) => level === levelSelection)
        : incomingLogs
    return logs.map((sse) => {
      return {
        id: generateUniqueId(),
        data: sse,
        level: sse.level,
        type,
        isHidden: false,
        createdAt: sse.time,
        updatedAt: sse.time,
      }
    })
  }, [incomingLogs, type, levelSelection])

  const reset = () => {
    resetLogs()
    setSearchText('')
    counterRef.current = 0
  }

  useEffect(() => {
    reset()
  }, [type])

  useEffect(() => {
    if (mappedIncoming.length) {
      appendLogs(mappedIncoming)
    }
  }, [mappedIncoming, appendLogs])

  const {
    data,
    fetchNextPage,
    isLoading: isInitialFetch,
    hasNextPage: hasOlderLogs,
  } = useInfiniteQuery({
    queryKey: ['logs', type, levelSelection],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({
        type,
        offset: String(pageParam),
      })

      if (levelSelection !== defaultSelection.value) {
        params.append('level', String(levelSelection))
      }
      return axios
        .get<LogData[]>(`/api/log-history?${params.toString()}`)
        .then((res) =>
          res.data.map((raw) => ({ ...raw, data: normalizeLogData(JSON.parse(raw.data)) })),
        )
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length >= LOG_FETCH_LIMIT ? allPages.length * LOG_FETCH_LIMIT : undefined,
  })

  useEffect(() => {
    if (isInitialFetch) return
    setIsInitialHistoryLoading(false)
  }, [isInitialFetch])

  useEffect(() => {
    if (!data) return

    const currentCount = data.pages.length
    const newLogs = data.pages[currentCount - 1]
    prependLogs(newLogs)

    virtuosoRef?.current?.scrollToIndex({
      index: newLogs.length,
      behavior: 'auto',
      align: 'end',
    })
  }, [data, prependLogs])

  const { data: searchedLogs = [], status: searchStatus } = useQuery({
    queryKey: ['searchLogs', type, debouncedSearchText],
    queryFn: ({ signal }) =>
      axios
        .get<LogData[]>(`/api/search-logs?type=${type}&search=${debouncedSearchText}`, { signal })
        .then((r) =>
          r.data.map((raw) => ({ ...raw, data: normalizeLogData(JSON.parse(raw.data)) })),
        ),
    enabled: isSearchView,
    refetchOnWindowFocus: false,
  })

  const scrollToBottom = useCallback(() => {
    if (!virtuosoRef.current) return

    const logs = isSearchView ? searchedLogs : logBucket

    virtuosoRef.current.scrollToIndex({
      index: logs.length - 1,
      behavior: 'smooth',
    })
  }, [virtuosoRef, isSearchView, searchedLogs, logBucket])

  const loadOlderLogs = async () => {
    setIsHistoryFetching(true)
    await fetchNextPage()
    setTimeout(() => {
      setIsHistoryFetching(false)
    }, 1000)
  }

  const isInitialLoading = !isSearchView && isInitialHistoryLoading
  const isSearchLoadingState = isSearchView && searchStatus === 'pending'

  const isFullScreenLoading = isInitialLoading || isSearchLoadingState

  const renderLogContent = useMemo(() => {
    if (isFullScreenLoading) {
      return (
        <div className='flex-1 flex items-center justify-center'>
          <LoadingDots />
        </div>
      )
    }

    if (searchedLogs.length) {
      return <VirtualLogList logs={searchedLogs} ref={virtuosoRef} />
    }

    if (logBucket.length && !isSearchView) {
      return (
        <VirtualLogList
          logs={logBucket}
          ref={virtuosoRef}
          isLoadingMore={isHistoryFetching}
          {...(hasOlderLogs ? { onLoadMore: loadOlderLogs } : {})}
        />
      )
    }

    return (
      <div className='flex-1 flex items-center justify-center'>
        <Typography type='text-caption1' isUpperCase>
          {t('logs.noLogsFound')}
        </Typography>
      </div>
    )
  }, [searchedLogs, logBucket, isSearchView, isFullScreenLoading, hasOlderLogs, isHistoryFetching])

  const changeLevel = (value: OptionType) => {
    setLevelSelection(value)
    reset()
  }

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
              className='absolute z-50 bottom-5 right-5 text-primary text-4xl opacity-0 cursor-pointer group-hover:opacity-100 bi-arrow-down-circle-fill'
            />
            <div className='w-full flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between pb-6 border-b-style500'>
              <div className='w-fit space-y-2'>
                <Typography className='w-fit' type='text-caption1' isUpperCase>
                  {type}
                </Typography>
                <hr className='w-full h-1' />
              </div>
              <div className='flex space-x-12 items-center'>
                <SelectDropDown
                  label={`${t('logLevel')}:`}
                  labelClass='text-caption1.5 uppercase'
                  value={levelSelection}
                  onSelect={changeLevel}
                  options={levelOptions}
                />
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className='h-8'
                  inputStyle='secondary'
                  placeholder={t('logs.searchLogs')}
                  icon='bi-search'
                />
              </div>
            </div>

            {/* Static Column Headers */}
            <div className='hidden lg:flex w-full border-b border-style500 bg-gray-50 dark:bg-dark800 sticky top-0 z-10'>
              <div className='px-3 py-2 w-[90px] flex-shrink-0 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide'>
                Time
              </div>
              <div className='px-2 py-2 w-[50px] flex-shrink-0 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide'>
                Level
              </div>
              <div className='px-3 py-2 w-[180px] flex-shrink-0 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide'>
                Service
              </div>
              <div className='px-3 py-2 w-[400px] flex-shrink-0 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide'>
                Message
              </div>
              <div className='px-3 py-2 flex-1 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide'>
                Details
              </div>
            </div>

            {/* Mobile Header */}
            <div className='lg:hidden border-b border-style500 bg-gray-50 dark:bg-dark800 px-4 py-2'>
              <Typography
                type='text-caption1'
                className='text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide'
              >
                Log Entries
              </Typography>
            </div>

            {renderLogContent}
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
              logMetrics={metrics}
            />
          </div>
        </>
      )}
    </div>
  )
})

LogDisplay.displayName = 'LogDisplay'

export default LogDisplay
