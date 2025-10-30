'use client'

import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardWrapper from '../../../src/components/DashboardWrapper/DashboardWrapper'
import SettingsMenuItem from '../../../src/components/Settings/SettingsMenuItem'
import ViewController from '../../../src/components/Settings/views/ViewController'
import Typography from '../../../src/components/Typography/Typography'
import { SettingsView } from '../../../src/constants/enums'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import {
  useActivities,
  useBeaconSpec,
  useBeaconVersion,
  useNodeHealth,
  useSyncData,
  useValidatorExclusionList,
  useValidatorVersion,
} from '../../../src/hooks/useSharedData'

export interface MainProps {
  // All data is now fetched client-side for instant navigation
}

const Main: FC<MainProps> = () => {
  const { t } = useTranslation()

  const { isValidatorError, isBeaconError } = useNetworkMonitor()
  const [view, setView] = useState(SettingsView.GENERAL)

  const networkError = isValidatorError || isBeaconError

  // Fetch all data client-side from global cache - instant navigation!
  // Static data (versions, spec) cached infinitely - never refetched
  const { data: beaconSpec } = useBeaconSpec()
  const { data: beaconVersionData } = useBeaconVersion()
  const { data: validatorVersionData } = useValidatorVersion()
  const { data: nodeHealth } = useNodeHealth(undefined, networkError)
  const { data: initActivityData } = useActivities()
  const { data: initExclusionList } = useValidatorExclusionList()

  // Wait for beaconSpec to load before calculating slot interval
  const slotInterval = beaconSpec ? beaconSpec.SECONDS_PER_SLOT * 1000 : 12000
  const { data: syncData } = useSyncData(slotInterval, undefined, networkError)

  // Show loading state while critical data loads
  // On subsequent navigations, data will be instantly available from SWR cache
  if (
    !beaconSpec ||
    !nodeHealth ||
    !syncData ||
    !initActivityData ||
    !beaconVersionData ||
    !validatorVersionData
  ) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>
  }

  const bnVersion = beaconVersionData.version
  const lighthouseVersion = validatorVersionData.version

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
          initExclusions={initExclusionList || []}
          bnVersion={bnVersion}
          vcVersion={lighthouseVersion}
          view={view}
        />
      </div>
    </DashboardWrapper>
  )
}

export default Main
