import Typography from '../Typography/Typography'
import AlertCard from '../AlertCard/AlertCard'
import { useTranslation } from 'react-i18next'
import useDiagnosticAlerts from '../../hooks/useDiagnosticAlerts'
import useDivDimensions from '../../hooks/useDivDimensions'
import { useEffect, useMemo } from 'react'
import sortAlertMessagesBySeverity from '../../utilities/sortAlerts'
import { StatusColor } from '../../types'

const AlertInfo = () => {
  const { t } = useTranslation()
  const { alerts, dismissAlert, resetDismissed } = useDiagnosticAlerts()
  const isFiller = alerts.length < 6
  const { ref, dimensions } = useDivDimensions()

  const sortedAlerts = useMemo(() => {
    return sortAlertMessagesBySeverity(alerts)
  }, [alerts])

  useEffect(() => {
    const intervalId = setInterval(() => {
      resetDismissed()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div ref={ref} className='h-full w-full flex flex-col border-l-0 border-t-0 border-style500'>
      <div className='w-full h-12 flex items-center justify-between px-4 md:border-l-0 border-r-0 border-style500'>
        <Typography type='text-caption1' color='text-primary' darkMode='dark:text-white' isBold>
          {t('alertInfo.alerts')}
        </Typography>
        <Typography type='text-tiny' className='uppercase' color='text-dark400'>
          {t('viewAll')}
        </Typography>
      </div>
      {dimensions && (
        <div
          style={{ maxHeight: `${dimensions.height - 48}px` }}
          className='h-full w-full flex flex-col'
        >
          {sortedAlerts.length > 0 && (
            <div className={`overflow-scroll scrollbar-hide ${!isFiller ? 'flex-1' : ''}`}>
              {sortedAlerts.map((alert) => {
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
