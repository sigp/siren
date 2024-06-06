'use client'

import Cookies from 'js-cookie';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { ButtonFace } from '../../../src/components/Button/Button'
import DeviceHealth from '../../../src/components/HealthCheck/DeviceHealth'
import HealthOverview from '../../../src/components/HealthCheck/HealthOverview'
import NetworkHealth from '../../../src/components/HealthCheck/NetworkHealth'
import ValidatorSetupLayout from '../../../src/components/ValidatorSetupLayout/ValidatorSetupLayout'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import { SetupProps } from '../../../src/types'
import { Diagnostics } from '../../../src/types/diagnostic'

export interface MainProps extends SetupProps {}

const Main: FC<MainProps> = ({ initNodeHealth, beaconSpec, initSyncData }) => {
  const { t } = useTranslation()
  const { SECONDS_PER_SLOT } = beaconSpec
  const slotInterval = Number(SECONDS_PER_SLOT) * 1000
  const { isValidatorError, isBeaconError } = useNetworkMonitor()
  const networkError = isValidatorError || isBeaconError

  const { data: nodeHealth } = useSWRPolling<Diagnostics>('/api/node-health', {
    refreshInterval: 6000,
    fallbackData: initNodeHealth,
    networkError,
  })
  const { data: syncData } = useSWRPolling('/api/node-sync', {
    refreshInterval: slotInterval,
    fallbackData: initSyncData,
    networkError,
  })

  const { beaconSync: isSyncing } = syncData

  useEffect(() => {
    Cookies.set('health-check', 'true')
  }, [])

  return (
    <div className='relative h-screen w-screen overflow-hidden flex'>
      <ValidatorSetupLayout
        nextUrl='/setup/node-sync'
        currentStep={t('healthCheck')}
        title={t('vcHealthCheck.title')}
        ctaText={t('continue')}
        ctaIcon='bi-arrow-right'
        ctaType={ButtonFace.SECONDARY}
      >
        <DeviceHealth isSyncing={isSyncing} nodeHealth={nodeHealth} />
        <NetworkHealth nodeHealth={nodeHealth} syncData={syncData} />
        <HealthOverview isSyncing={isSyncing} nodeHealth={nodeHealth} />
      </ValidatorSetupLayout>
    </div>
  )
}

export default Main
