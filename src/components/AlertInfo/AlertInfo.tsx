import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import sortAlertMessagesBySeverity from '../../../utilities/sortAlerts'
import useDiagnosticAlerts from '../../hooks/useDiagnosticAlerts'
import useDivDimensions from '../../hooks/useDivDimensions'
import useMediaQuery from '../../hooks/useMediaQuery'
import { proposerDuties } from '../../recoil/atoms'
import { LogLevels, StatusColor } from '../../types'
import AlertCard from '../AlertCard/AlertCard'
import AlertFilterSettings, { FilterValue } from '../AlertFilterSettings/AlertFilterSettings'
import { LogsInfoProps } from '../DiagnosticTable/LogsInfo'
import ProposerAlerts, { ProposerAlertsProps } from '../ProposerAlerts/ProposerAlerts'
import Typography from '../Typography/Typography'
import PriorityLogAlerts from './PriorityLogAlerts'

export interface AlertInfoProps extends Omit<ProposerAlertsProps, 'duties'>, LogsInfoProps {}

const AlertInfo: FC<AlertInfoProps> = ({ metrics, ...props }) => {
  const { t } = useTranslation()
  const { alerts, dismissAlert, resetDismissed } = useDiagnosticAlerts()
  const { ref, dimensions } = useDivDimensions()
  const headerDimensions = useDivDimensions()
  const [filter, setFilter] = useState('all')
  const duties = useRecoilValue(proposerDuties)

  const priorityLogAlerts = useMemo(() => {
    return Object.values(metrics)
      .flat()
      .filter(({ level }) => level === LogLevels.CRIT || level === LogLevels.ERRO)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [metrics])

  const setFilterValue = (value: FilterValue) => setFilter(value)
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
    formattedAlerts.length + (duties?.length || 0) + (priorityLogAlerts.length || 0) < 6
  const isPriorityAlerts = priorityLogAlerts.length > 0
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
              {isPriorityAlerts && isSeverFilter && (
                <PriorityLogAlerts alerts={priorityLogAlerts} />
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
