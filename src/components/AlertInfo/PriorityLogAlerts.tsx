import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import moment from 'moment';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import displayToast from '../../../utilities/displayToast';
import { LogData, StatusColor, ToastType } from '../../types';
import AlertCard from '../AlertCard/AlertCard';
import LoadingDots from '../LoadingDots/LoadingDots';
import Typography from '../Typography/Typography';

export interface LogAlertsProps {
  alerts: LogData[]
  hasNextPage: boolean
  onLoadMore?: (() => void) | undefined
  isLoading: boolean
}

const PriorityLogAlerts:FC<LogAlertsProps> = ({alerts, hasNextPage, onLoadMore, isLoading}) => {
  const {t} = useTranslation()

  const [data, setData] = useState(alerts)

  useEffect(() => {
    setData(alerts)
  }, [alerts])

  const visibleAlerts = useMemo(() => {
    return data.filter(({isHidden}) => !isHidden)
  }, [data])

  const dismissAlert = async (id: number) => {
    try {
      const token = Cookies.get('session-token')
      const {status} = await axios.put(`/api/dismiss-log/${id}`, undefined,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(status === 200) {
        setData(prev => {
          let log = prev.find(alert => alert.id === id)

          if(!log) {
            return prev
          }

          log.isHidden = true

          return [...prev.filter(alert => alert.id !== id), log] as LogData[]
        })
        displayToast(t('alertMessages.dismiss.success'), ToastType.SUCCESS)
      }
    } catch (e) {
      console.error('error updating log...')
      displayToast(t('alertMessages.dismiss.error'), ToastType.ERROR)
    }
  }

  return (
    <AnimatePresence>
      {
        visibleAlerts.map(({id, data, createdAt}) => {
          const alertData = JSON.parse(data)
          const date = moment(createdAt).fromNow()
          return (
            <AlertCard
              key={id}
              animKey={`priority-${id}`}
              status={StatusColor.ERROR}
              count={3}
              onClick={() => dismissAlert(id)}
              subText={t('poor')}
              text={`${t(`alertMessages.log.${alertData.level}`)}: ${alertData.msg} ${date}`}
            />
          )
        })
      }
      {hasNextPage && onLoadMore && (
        <div onClick={onLoadMore} className="flex items-center justify-center py-4 border-b-style500 cursor-pointer dark:bg-dark700">
          {isLoading ? (
            <LoadingDots  size={1}/>
          ) : (
            <Typography className="underline" type="text-caption1" isCapitalize>{t('alertMessages.log.loadMore')}</Typography>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}

export default PriorityLogAlerts;