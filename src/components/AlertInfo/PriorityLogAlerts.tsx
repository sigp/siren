import axios from 'axios'
import moment from 'moment'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import {FETCH_LOG_LIMIT} from "../../constants/constants";
import useSSEData from "../../hooks/useSSEData";
import { LogData, StatusColor, ToastType } from '../../types'
import AlertCard from '../AlertCard/AlertCard'
import Typography from "../Typography/Typography";

export interface LogAlertsProps {
  alerts: LogData[]
}

const PriorityLogAlerts: FC<LogAlertsProps> = ({ alerts }) => {
  const { t } = useTranslation()
  const [data, setData] = useState<LogData[]>(alerts)
  const [hasMoreLogs, setHasMoreLogs] = useState(false)

  const { data: streamedData } = useSSEData({
    url: '/priority-log-stream',
    isReady: true,
    isStateStore: true,
  })

  useEffect(() => {
    if(streamedData.length) {
      setData((prev) => {
        const combined = [...prev, ...streamedData];
        return [...new Map(combined.map(item => [item.id, item])).values()];
      });
    }
  }, [streamedData])

  useEffect(() => {
    if(alerts.length >= FETCH_LOG_LIMIT) {
      setHasMoreLogs(true)
    }
  }, [alerts])

  const visibleOrderedAlerts = useMemo(() => {
    return data.filter(({ isHidden }) => !isHidden)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [data])

  const dismissAlert = async (id: number) => {
    try {
      const { status } = await axios.put(`/api/dismiss-log/${id}`, undefined)

      if (status === 200) {
        setData((prev) => {
          let log = prev.find((alert) => alert.id === id)

          if (!log) {
            return prev
          }

          log.isHidden = true

          return [...prev.filter((alert) => alert.id !== id), log] as LogData[]
        })
        displayToast(t('alertMessages.dismiss.success'), ToastType.SUCCESS)
      }
    } catch (e) {
      console.error('error updating log...')
      displayToast(t('alertMessages.dismiss.error'), ToastType.ERROR)
    }
  }

  const fetchOlderLogs = async () => {
    try {
      const oldestLogDate = data.reduce((oldest, current) => {
        return new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest;
      }).createdAt

      const { data: fetchedData } = await axios.get(`/api/priority-logs?since=${oldestLogDate}`)

      if(fetchedData.length) {
        if(fetchedData.length < FETCH_LOG_LIMIT) {
          setHasMoreLogs(false)
        }
        setData((prev) => {
          const combined = [...prev, ...fetchedData];
          return [...new Map(combined.map(item => [item.id, item])).values()];
        });
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      {
        visibleOrderedAlerts.map(({ id, data, createdAt }) => {
          const alertData = JSON.parse(data)
          const date = moment(createdAt).fromNow()
          return (
            <AlertCard
              key={id}
              status={StatusColor.ERROR}
              count={3}
              onClick={() => dismissAlert(id)}
              subText={t('poor')}
              text={`${alertData.msg} ${date}`}
            />
          )
        })
      }
      {
        hasMoreLogs ? (
          <div onClick={fetchOlderLogs} className="w-full bg-red-600 p-2">
            <Typography>Load More Logs</Typography>
          </div>
        ) : null
      }
    </>
  )
}

export default PriorityLogAlerts
