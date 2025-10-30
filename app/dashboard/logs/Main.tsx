import { FC, useEffect, useState } from 'react'
import DashboardWrapper from '../../../src/components/DashboardWrapper/DashboardWrapper'
import LogControls from '../../../src/components/LogControls/LogControls'
import LogDisplay from '../../../src/components/LogDisplay/LogDisplay'
import { OptionType } from '../../../src/components/SelectDropDown/SelectDropDown'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import { useNodeHealth, useSyncData } from '../../../src/hooks/useSharedData'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import { ActivityResponse, LogMetric, LogType, Metric } from '../../../src/types'
import { BeaconNodeSpecResults, SyncData } from '../../../src/types/beacon'
import { Diagnostics } from '../../../src/types/diagnostic'

export interface MainProps {
  initNodeHealth: Diagnostics
  beaconSpec: BeaconNodeSpecResults
  initSyncData: SyncData
  initLogMetrics: LogMetric
  initMetrics: Metric
  initActivityData: ActivityResponse
  defaultLogType: LogType
}

const Main: FC<MainProps> = ({
  initSyncData,
  beaconSpec,
  initNodeHealth,
  initActivityData,
  initMetrics,
  defaultLogType,
}) => {
  const { SECONDS_PER_SLOT } = beaconSpec
  const { isValidatorError, isBeaconError } = useNetworkMonitor()
  const networkError = isValidatorError || isBeaconError
  const slotInterval = SECONDS_PER_SLOT * 1000

  const [logType, selectType] = useState(defaultLogType)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  // Use shared hooks for common data - this enables instant navigation
  // by reading from SWR's global cache across all pages
  const { data: syncData } = useSyncData(slotInterval, initSyncData, networkError)
  const { data: nodeHealth } = useNodeHealth(initNodeHealth, networkError)

  const { data: logMetrics } = useSWRPolling<Metric>(`/api/log-metrics?type=${logType}`, {
    refreshInterval: slotInterval / 2,
    fallbackData: initMetrics,
    networkError,
  })

  const toggleLogType = (selection: OptionType) => {
    if (selection === logType) return

    setLoading(true)
    selectType(selection as LogType)

    setTimeout(() => {
      setLoading(false)
    }, 250)
  }

  return (
    <DashboardWrapper
      initActivityData={initActivityData}
      syncData={syncData}
      beaconSpec={beaconSpec}
      isBeaconError={isBeaconError}
      isValidatorError={isValidatorError}
      nodeHealth={nodeHealth}
    >
      <div className='w-full h-full pt-8 p-2 md:p-6 flex flex-col'>
        <LogControls logType={logType} onSetLoading={setLoading} onTypeSelect={toggleLogType} />
        <LogDisplay metrics={logMetrics} isLoading={isLoading} type={logType} />
      </div>
    </DashboardWrapper>
  )
}

export default Main
