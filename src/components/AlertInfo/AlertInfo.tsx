import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import sortAlertMessagesBySeverity from '../../../utilities/sortAlerts';
import useDiagnosticAlerts from '../../hooks/useDiagnosticAlerts';
import useDivDimensions from '../../hooks/useDivDimensions';
import useMediaQuery from '../../hooks/useMediaQuery';
import { proposerDuties } from '../../recoil/atoms';
import { PriorityLogResults, StatusColor } from '../../types';
import AlertFilterSettings, { FilterValue } from '../AlertFilterSettings/AlertFilterSettings';
import ProposerAlerts, { ProposerAlertsProps } from '../ProposerAlerts/ProposerAlerts';
import Typography from '../Typography/Typography';
import PriorityLogAlerts from './PriorityLogAlerts';
import StandardAlerts from './StandardAlerts';

export interface AlertInfoProps extends Omit<ProposerAlertsProps, 'duties'> {
  logData: PriorityLogResults
  isLoadingPriority: boolean
  onLoadMore?: (() => void) | undefined
}

const AlertInfo: FC<AlertInfoProps> = ({logData, isLoadingPriority, onLoadMore, ...props}) => {
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
  const isPriorityAlerts = logData.logs.length > 0 && (filter === 'all' || filter === StatusColor.ERROR)
  const isAlerts = formattedAlerts.length > 0 || duties?.length > 0 || isPriorityAlerts
  const isProposerAlerts =
    duties?.length > 0 && (filter === 'all' || filter === StatusColor.SUCCESS)

  const totalAlertCount = formattedAlerts.length + (isPriorityAlerts ? duties.length + 1 : 0) + (isPriorityAlerts ? logData.logs.length : 0);
  const isFiller = totalAlertCount < 6

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
                } as any
          }
          className='h-full w-full flex flex-col'
        >
          {isAlerts && (
            <div className={`overflow-scroll scrollbar-hide ${!isFiller ? 'flex-1' : ''}`}>
              {isPriorityAlerts && <PriorityLogAlerts hasNextPage={logData.hasNextPage} isLoading={isLoadingPriority} onLoadMore={onLoadMore} alerts={logData.logs} />}
              <StandardAlerts onDismiss={dismissAlert} alerts={formattedAlerts} />
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
