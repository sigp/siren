import axios from 'axios'
import moment from 'moment'
import { FC, useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import { FETCH_LOG_LIMIT } from '../../constants/constants'
import useSSEData from '../../hooks/useSSEData'
import { LogData, StatusColor, ToastType } from '../../types'
import AlertCard from '../AlertCard/AlertCard'
import Spinner from '../Spinner/Spinner'
import Typography from '../Typography/Typography'

export interface LogAlertsProps {
  alerts: LogData[]
}

const PriorityLogAlerts: FC<LogAlertsProps> = ({ alerts }) => {
  const { t } = useTranslation()
  const [data, setData] = useState<LogData[]>(alerts)
  const [hasMoreLogs, setHasMoreLogs] = useState(alerts.length >= FETCH_LOG_LIMIT)
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    if (alerts.length >= FETCH_LOG_LIMIT) {
      setHasMoreLogs(true)
    }
  }, [alerts])

  const visibleOrderedAlerts = useMemo(() => {
    return data
      .filter(({ isHidden }) => !isHidden)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((alert) => ({
        ...alert,
        data: JSON.parse(alert.data),
        fromNowStamp: moment(alert.createdAt).fromNow(),
      }))
  }, [data])

  const dismissAlert = useCallback(
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
    setIsLoading(true)
    try {
      const oldestLog = data.reduce((oldest, current) =>
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
      setIsLoading(false)
    }
  }, [data])

  return (
    <>
      {visibleOrderedAlerts.map(({ id, data: alertData, fromNowStamp }) => (
        <AlertCard
          key={id}
          status={StatusColor.ERROR}
          count={3}
          onClick={() => dismissAlert(id)}
          subText={t('poor')}
          text={`${alertData.msg} ${fromNowStamp}`}
        />
      ))}
      {hasMoreLogs && (
        <div
          onClick={fetchOlderLogs}
          className='w-full flex items-center justify-center cursor-pointer bg-dark800 hover:bg-dark750 border-b-style500 p-2'
        >
          {isLoading ? (
            <Spinner size='w-4 h-4' />
          ) : (
            <Typography className='center' type='text-caption2'>
              {t('fetchMoreLogAlerts')}
            </Typography>
          )}
        </div>
      )}
    </>
  )
}

export default PriorityLogAlerts
