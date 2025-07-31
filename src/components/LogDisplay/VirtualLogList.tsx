import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { FormattedLogData } from '../../types'
import LoadingDots from '../LoadingDots/LoadingDots'
import Typography from '../Typography/Typography'
import LogRow from './LogRow'

interface VirtualLogListProps {
  logs: FormattedLogData[]
  onLoadMore?: () => void
  isLoadingMore?: boolean
  bottomPercent?: number
  inactivityTimeout?: number // in milliseconds
}

const VirtualLogList = forwardRef<VirtuosoHandle, VirtualLogListProps>(function VirtualLogList(
  { logs, onLoadMore, isLoadingMore, bottomPercent = 0.25, inactivityTimeout = 1000 },
  ref,
) {
  const { t } = useTranslation()
  const logListLength = logs.length
  const thresholdPx = logListLength * 52 * bottomPercent

  const [userInteracting, setUserInteracting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as NodeJS.Timeout)
      }
    }
  }, [])

  const scheduleInactivityReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current as NodeJS.Timeout)
    }
    timeoutRef.current = setTimeout(() => {
      setUserInteracting(false)
      timeoutRef.current = null
    }, inactivityTimeout as number)
  }

  const handleUserActivity = () => {
    setUserInteracting(true)
    scheduleInactivityReset()
  }

  const handleInactivity = () => {
    setUserInteracting(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current as NodeJS.Timeout)
      timeoutRef.current = null
    }
  }

  const handleScrollStateChange = (isScrolling: boolean) => {
    if (isScrolling) {
      setUserInteracting(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as NodeJS.Timeout)
      }
    } else {
      scheduleInactivityReset()
    }
  }

  const LoadMoreHeader = () =>
    onLoadMore ? (
      <button
        onClick={onLoadMore}
        className='w-full cursor-pointer bg-dark50 hover:bg-dark25 dark:bg-dark800 dark:hover:bg-dark700 p-4 flex flex-col items-center justify-center space-y-1'
        aria-label='Load older logs'
      >
        {isLoadingMore ? (
          <LoadingDots />
        ) : (
          <>
            <Typography type='text-caption1.5'>{t('loadOlderLogs')}</Typography>
            <i className='bi bi-arrow-up-circle text-caption1 text-primary' />
          </>
        )}
      </button>
    ) : null

  return (
    <div
      className='flex-1 min-h-0'
      onMouseMove={handleUserActivity}
      onMouseLeave={handleInactivity}
    >
      <Virtuoso
        className='scrollbar-hide'
        style={{ height: '100%' }}
        data={logs}
        ref={ref}
        components={{
          Header: LoadMoreHeader,
        }}
        initialTopMostItemIndex={logListLength > 0 ? logListLength - 1 : 0}
        followOutput={(isAtBottom) =>
          isAtBottom && !isLoadingMore && !userInteracting ? 'smooth' : false
        }
        atBottomThreshold={thresholdPx}
        itemContent={(_, item) => <LogRow log={item.data} />}
        isScrolling={handleScrollStateChange}
      />
    </div>
  )
})

VirtualLogList.displayName = 'VirtualLogList'

export default VirtualLogList
