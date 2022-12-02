import Typography from '../Typography/Typography'
import AlertCard from '../AlertCard/AlertCard'
import { useTranslation } from 'react-i18next'
import useDiagnosticAlerts from '../../hooks/useDiagnosticAlerts'

const AlertInfo = () => {
  const { t } = useTranslation()
  const { natAlert, peerCountAlert } = useDiagnosticAlerts()
  return (
    <div className='h-full w-full flex flex-col'>
      <div className='w-full h-12 flex items-center justify-between px-4 md:border-l-0 border-style500'>
        <Typography type='text-caption1' color='text-primary' darkMode='dark:text-white' isBold>
          {t('alertInfo.alerts')}
        </Typography>
        <Typography type='text-tiny' className='uppercase' color='text-dark400'>
          {t('viewAll')}
        </Typography>
      </div>
      {natAlert && (
        <AlertCard
          status={natAlert.severity}
          count={3}
          subText={natAlert.subText}
          text={natAlert.message}
        />
      )}
      {peerCountAlert && (
        <AlertCard
          status={peerCountAlert.severity}
          count={2}
          subText={peerCountAlert.subText}
          text={peerCountAlert.message}
        />
      )}
      <div className='flex-1 md:border-l-0 border-t-0 border-style500 flex items-center justify-center'>
        <i className='bi bi-lightning-fill text-primary text-h3 opacity-20' />
      </div>
    </div>
  )
}

export default AlertInfo
