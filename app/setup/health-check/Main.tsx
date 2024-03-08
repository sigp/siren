'use client'

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { ButtonFace } from '../../../src/components/Button/Button';
import DeviceHealth from '../../../src/components/HealthCheck/DeviceHealth';
import HealthOverview from '../../../src/components/HealthCheck/HealthOverview';
import NetworkHealth from '../../../src/components/HealthCheck/NetworkHealth';
import ValidatorSetupLayout from '../../../src/components/ValidatorSetupLayout/ValidatorSetupLayout';
import { BeaconSyncResult, HealthDiagnosticResult, ValidatorSyncResult } from '../../../src/types/diagnostic';
import swrGetFetcher from '../../../utilities/swrGetFetcher';

export interface MainProps {
  healthData: HealthDiagnosticResult
  beaconSync: BeaconSyncResult
  executionSync: ValidatorSyncResult
}

const Main:FC<MainProps> = ({healthData, beaconSync, executionSync}) => {
  const {t} = useTranslation()
  const { data: bnHealth } = useSWR('/api/beacon-health', swrGetFetcher, {refreshInterval: 6000, fallbackData: {data: healthData}})
  const { data: exSync } = useSWR('/api/execution-sync', swrGetFetcher, {refreshInterval: 12000, fallbackData: {data: executionSync}})
  const { data: bnSync } = useSWR('/api/beacon-sync', swrGetFetcher, {refreshInterval: 12000, fallbackData: {data: beaconSync}})


  const viewSessionAuth = () => {}
  const viewSync = () => {}
  return (
    <div className='relative h-screen w-screen overflow-hidden flex'>
      <ValidatorSetupLayout
        onStepBack={viewSessionAuth}
        onNext={viewSync}
        currentStep={t('healthCheck')}
        title={t('vcHealthCheck.title')}
        ctaText={t('continue')}
        ctaIcon='bi-arrow-right'
        ctaType={ButtonFace.SECONDARY}
      >
        <DeviceHealth health={bnHealth.data} />
        <NetworkHealth
          bnHealth={bnHealth.data}
          exSyncInfo={exSync.data}
          bnSyncInfo={bnSync.data} />
        <HealthOverview bnHealth={bnHealth.data} />
      </ValidatorSetupLayout>
    </div>
  )
}


export default Main