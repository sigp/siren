'use client'

import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import pckJson from '../../../package.json'
import DashboardWrapper from '../../../src/components/DashboardWrapper/DashboardWrapper'
import SettingsMenuItem from '../../../src/components/Settings/SettingsMenuItem'
import ViewController from '../../../src/components/Settings/views/ViewController'
import Typography from '../../../src/components/Typography/Typography'
import { SettingsView } from '../../../src/constants/enums'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import { ActivityResponse, ExcludedStatus } from '../../../src/types'
import { BeaconNodeSpecResults, SyncData } from '../../../src/types/beacon'
import { Diagnostics } from '../../../src/types/diagnostic'

export interface MainProps {
  initNodeHealth: Diagnostics
  initSyncData: SyncData
  beaconSpec: BeaconNodeSpecResults
  bnVersion: string
  lighthouseVersion: string
  initActivityData: ActivityResponse
  initExclusionList: ExcludedStatus[]
}

const Main: FC<MainProps> = (props) => {
  const { t } = useTranslation()
  const {
    initNodeHealth,
    initSyncData,
    beaconSpec,
    lighthouseVersion,
    bnVersion,
    initActivityData,
    initExclusionList,
  } = props

  const { version } = pckJson
  const { SECONDS_PER_SLOT } = beaconSpec

  const { isValidatorError, isBeaconError } = useNetworkMonitor()
  const [view, setView] = useState(SettingsView.GENERAL)

  const networkError = isValidatorError || isBeaconError
  const slotInterval = SECONDS_PER_SLOT * 1000
  const { data: nodeHealth } = useSWRPolling<Diagnostics>('/api/node-health', {
    refreshInterval: 6000,
    fallbackData: initNodeHealth,
    networkError,
  })
  const { data: syncData } = useSWRPolling<SyncData>('/api/node-sync', {
    refreshInterval: slotInterval,
    fallbackData: initSyncData,
    networkError,
  })

  const viewGeneralSettings = () => setView(SettingsView.GENERAL)
  const viewAboutSettings = () => setView(SettingsView.ABOUT)
  const viewDataManagement = () => setView(SettingsView.DATA)

  return (
    <DashboardWrapper
      initActivityData={initActivityData}
      syncData={syncData}
      beaconSpec={beaconSpec}
      isBeaconError={isBeaconError}
      isValidatorError={isValidatorError}
      nodeHealth={nodeHealth}
    >
      <div className='flex flex-1 min-h-full'>
        <div className='hidden md:block z-20 flex-1 w-full p-4 max-w-[150px] max-w-[250px] xl:max-w-xs bg-dark50 dark:bg-dark900'>
          <div className='mb-24'>
            <div className='p-2 border-b-style border-dark200'>
              <Typography isCapitalize>{t('settings')}</Typography>
            </div>
            <SettingsMenuItem
              isActive={view === SettingsView.GENERAL}
              text={t('general')}
              onClick={viewGeneralSettings}
              icon='bi-house'
            />
            <SettingsMenuItem
              isActive={view === SettingsView.DATA}
              text={t('dataManagement')}
              onClick={viewDataManagement}
              icon='bi-clipboard-data'
            />
            <SettingsMenuItem
              isActive={view === SettingsView.ABOUT}
              text={t('about')}
              onClick={viewAboutSettings}
              icon='bi-info-circle'
            />
          </div>
        </div>
        <ViewController
          initExclusions={initExclusionList}
          bnVersion={bnVersion}
          vcVersion={lighthouseVersion}
          sirenVersion={version}
          view={view}
        />
      </div>
    </DashboardWrapper>
  )
}

export default Main
