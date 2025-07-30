import axios from 'axios'
import moment from 'moment/moment'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import displayToast from '../../../utilities/displayToast'
import sortAlertMessagesBySeverity from '../../../utilities/sortAlerts'
import { FETCH_LOG_LIMIT } from '../../constants/constants'
import useDiagnosticAlerts from '../../hooks/useDiagnosticAlerts'
import useDivDimensions from '../../hooks/useDivDimensions'
import useMediaQuery from '../../hooks/useMediaQuery'
import useSSEData from '../../hooks/useSSEData'
import { proposerDuties } from '../../recoil/atoms'
import { LogData, StatusColor, ToastType } from '../../types'
import AlertCard from '../AlertCard/AlertCard'
import AlertFilterSettings, { FilterValue } from '../AlertFilterSettings/AlertFilterSettings'
import ProposerAlerts, { ProposerAlertsProps } from '../ProposerAlerts/ProposerAlerts'
import Typography from '../Typography/Typography'
import PriorityLogAlerts from './PriorityLogAlerts'

export interface AlertInfoProps extends Omit<ProposerAlertsProps, 'duties'> {
  priorityLogs: LogData[]
}

const AlertInfo: FC<AlertInfoProps> = ({ priorityLogs, ...props }) => {
  const { t } = useTranslation()
  const { alerts, dismissAlert, resetDismissed } = useDiagnosticAlerts()
  const { ref, dimensions } = useDivDimensions()
  const headerDimensions = useDivDimensions()
  const [filter, setFilter] = useState('all')
  const duties = useRecoilValue(proposerDuties)
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)
  const [priorityLogData, setData] = useState<LogData[]>(priorityLogs)
  const [hasMoreLogs, setHasMoreLogs] = useState(priorityLogs.length >= FETCH_LOG_LIMIT)

  const { data: streamedData } = useSSEData<LogData[]>({
    url: '/priority-log-stream',
    isReady: true,
    isStateStore: true,
  })

  useEffect(() => {
    if (!streamedData?.length) return

    setData((prev: LogData[]) => {
      const combined = [...prev, ...streamedData]
      return Array.from(new Map(combined.map((item) => [item.id, item])).values())
    })
  }, [streamedData])

  const dismissLog = useCallback(
    async (id: number) => {
      try {
        const { status } = await axios.put(`/api/dismiss-log/${id}`)

        if (status !== 200) return

        setData((prev) =>
          prev.map((alert) => (alert.id === id ? { ...alert, isHidden: true } : alert)),
        )
        displayToast(t('alertMessages.dismiss.success'), ToastType.SUCCESS)
      } catch (error) {
        console.error('Error updating log:', error)
        displayToast(t('alertMessages.dismiss.error'), ToastType.ERROR)
      }
    },
    [t],
  )

  const fetchOlderLogs = useCallback(async () => {
    setIsLoadingLogs(true)
    try {
      const oldestLog = priorityLogData.reduce((oldest, current) =>
        new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest,
      )
      const oldestLogDate = oldestLog.createdAt

      const { data: fetchedData } = await axios.get(`/api/priority-logs?since=${oldestLogDate}`)

      const count = fetchedData?.length

      if (!count) return

      if (count < FETCH_LOG_LIMIT) {
        setHasMoreLogs(false)
      }
      setData((prev) => {
        const combined = [...prev, ...fetchedData]
        return Array.from(new Map(combined.map((item) => [item.id, item])).values())
      })
    } catch (error) {
      console.error('Error fetching older logs:', error)
    } finally {
      setIsLoadingLogs(false)
    }
  }, [priorityLogData])

  const visibleOrderedAlerts = useMemo(() => {
    return priorityLogData
      .filter(({ isHidden }) => !isHidden)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((alert) => ({
        ...alert,
        data: JSON.parse(alert.data),
        fromNowStamp: moment(alert.createdAt).fromNow(),
      }))
  }, [priorityLogData])

  const setFilterValue = useCallback((value: FilterValue) => setFilter(value), [])
  const isMobile = useMediaQuery('(max-width: 425px)')

  const formattedAlerts = useMemo(() => {
    let baseAlerts = alerts

    if (filter !== 'all') {
      baseAlerts = baseAlerts.filter(({ severity }) => severity === filter)
    }

    return sortAlertMessagesBySeverity(baseAlerts)
  }, [alerts, filter])

  const isSeverFilter = filter === 'all' || filter === StatusColor.ERROR

  const isFiller =
    formattedAlerts.length + (duties?.length || 0) + (visibleOrderedAlerts.length || 0) < 6
  const isPriorityAlerts = visibleOrderedAlerts.length > 0
  const isAlerts = formattedAlerts.length > 0 || duties?.length > 0 || isPriorityAlerts
  const isProposerAlerts =
    duties?.length > 0 && (filter === 'all' || filter === StatusColor.SUCCESS)

  useEffect(() => {
    const intervalId = setInterval(() => {
      resetDismissed()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [resetDismissed])

  return (
    <div
      ref={ref}
      className='h-full w-full flex flex-col md:border-l-0 border-t-0 border-style500 border-b border-b-style500'
    >
      <div
        ref={headerDimensions.ref}
        className='w-full h-12 flex items-center justify-between px-4 border-l-0 border-r-0 border-style500 border-t border-b flex-shrink-0'
      >
        <Typography type='text-caption1' color='text-primary' darkMode='dark:text-white' isBold>
          {t('alertInfo.alerts')}
        </Typography>
        <AlertFilterSettings value={filter as FilterValue} onChange={setFilterValue} />
      </div>
      {dimensions && (
        <div
          style={
            isMobile
              ? undefined
              : {
                  maxHeight: `${dimensions.height - (headerDimensions?.dimensions?.height || 0)}px`,
                }
          }
          className='h-full w-full flex flex-col'
        >
          {isAlerts && (
            <div className={`overflow-scroll scrollbar-hide ${!isFiller ? 'flex-1' : ''}`}>
              {isSeverFilter && (
                <PriorityLogAlerts
                  hasMoreLogs={hasMoreLogs}
                  onFetchLogs={fetchOlderLogs}
                  onDismissAlert={dismissLog}
                  isLoading={isLoadingLogs}
                  alerts={visibleOrderedAlerts}
                />
              )}
              {formattedAlerts.map((alert) => {
                const { severity, subText, message, id } = alert
                const count =
                  severity === StatusColor.SUCCESS ? 1 : severity === StatusColor.WARNING ? 2 : 3
                return (
                  <AlertCard
                    key={id}
                    status={severity}
                    count={count}
                    onClick={() => dismissAlert(alert)}
                    subText={subText}
                    text={message}
                  />
                )
              })}
              {isProposerAlerts && <ProposerAlerts {...props} duties={duties} />}
            </div>
          )}
          {isFiller && (
            <div className='flex-1 flex items-center justify-center'>
              <i className='bi bi-lightning-fill text-primary text-h3 opacity-20' />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AlertInfo
