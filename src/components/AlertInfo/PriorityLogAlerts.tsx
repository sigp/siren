import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { FormattedLogData, StatusColor } from '../../types'
import AlertCard from '../AlertCard/AlertCard'
import Spinner from '../Spinner/Spinner'
import Typography from '../Typography/Typography'

export interface LogAlertsProps {
  alerts: FormattedLogData[]
  isLoading: boolean
  onDismissAlert: (id: number) => void
  onFetchLogs: () => void
  hasMoreLogs: boolean
}

const PriorityLogAlerts: FC<LogAlertsProps> = ({
  alerts,
  isLoading,
  onDismissAlert,
  onFetchLogs,
  hasMoreLogs,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {alerts.map(({ id, data, fromNowStamp }) => (
        <AlertCard
          key={id}
          status={StatusColor.ERROR}
          count={3}
          onClick={() => onDismissAlert(id)}
          subText={t('poor')}
          text={`${data.msg} ${fromNowStamp}`}
        />
      ))}
      {hasMoreLogs && (
        <div
          onClick={onFetchLogs}
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
