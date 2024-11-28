import axios from 'axios'
import moment from 'moment'
import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import { LogData, StatusColor, ToastType } from '../../types'
import AlertCard from '../AlertCard/AlertCard'

export interface LogAlertsProps {
  alerts: LogData[]
}

const PriorityLogAlerts: FC<LogAlertsProps> = ({ alerts }) => {
  const { t } = useTranslation()

  const [data, setData] = useState(alerts)

  useEffect(() => {
    setData(alerts)
  }, [alerts])

  const visibleAlerts = useMemo(() => {
    return data.filter(({ isHidden }) => !isHidden)
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

  return visibleAlerts.map(({ id, data, createdAt }) => {
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

export default PriorityLogAlerts
