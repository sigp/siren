import Typography from '../Typography/Typography'
import AlertCard from '../AlertCard/AlertCard'
import { useTranslation } from 'react-i18next'
import useDiagnosticAlerts from '../../hooks/useDiagnosticAlerts'
import useDivDimensions from '../../hooks/useDivDimensions'
import { useEffect, useMemo, useState } from 'react'
import sortAlertMessagesBySeverity from '../../utilities/sortAlerts'
import { StatusColor } from '../../types'
import AlertFilterSettings, { FilterValue } from '../AlertFilterSettings/AlertFilterSettings'
import useMediaQuery from '../../hooks/useMediaQuery'
import { useRecoilValue } from 'recoil'
import ProposerAlerts from '../ProposerAlerts/ProposerAlerts'
import { proposerDuties } from '../../recoil/atoms'

const AlertInfo = () => {
  const { t } = useTranslation()
  const { alerts, dismissAlert, resetDismissed } = useDiagnosticAlerts()
  const { ref, dimensions } = useDivDimensions()
  const headerDimensions = useDivDimensions()
  const [filter, setFilter] = useState('all')
  const duties = useRecoilValue(proposerDuties)

  const setFilterValue = (value: FilterValue) => setFilter(value)
  const isMobile = useMediaQuery('(max-width: 425px)')

  const formattedAlerts = useMemo(() => {
    let baseAlerts = alerts

    if (filter !== 'all') {
      baseAlerts = baseAlerts.filter(({ severity }) => severity === filter)
    }

    return sortAlertMessagesBySeverity(baseAlerts)
  }, [alerts, filter])

  const isFiller = formattedAlerts.length + (duties?.length || 0) < 6
  const isAlerts = formattedAlerts.length > 0 || duties?.length > 0
  const isProposerAlerts =
    duties?.length > 0 && (filter === 'all' || filter === StatusColor.SUCCESS)

  useEffect(() => {
    const intervalId = setInterval(() => {
      resetDismissed()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div ref={ref} className='h-full w-full flex flex-col md:border-l-0 border-t-0 border-style500'>
      <div
        ref={headerDimensions.ref}
        className='w-full h-12 flex items-center justify-between px-4 border-l-0 border-r-0 border-style500'
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
              {isProposerAlerts && <ProposerAlerts duties={duties} />}
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
