'use client'

import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LighthouseSvg from '../../../src/assets/images/lighthouse-black.svg'
import AppDescription from '../../../src/components/AppDescription/AppDescription'
import AppVersion from '../../../src/components/AppVersion/AppVersion'
import DashboardWrapper from '../../../src/components/DashboardWrapper/DashboardWrapper'
import Input from '../../../src/components/Input/Input'
import SocialIcon from '../../../src/components/SocialIcon/SocialIcon'
import Toggle from '../../../src/components/Toggle/Toggle'
import Typography from '../../../src/components/Typography/Typography'
import UiModeIcon from '../../../src/components/UiModeIcon/UiModeIcon'
import {
  DiscordUrl,
  LighthouseBookUrl,
  SigPGithubUrl,
  SigPIoUrl,
  SigPTwitter,
} from '../../../src/constants/constants'
import { UiMode } from '../../../src/constants/enums'
import useLocalStorage from '../../../src/hooks/useLocalStorage'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import useUiMode from '../../../src/hooks/useUiMode'
import { OptionalString } from '../../../src/types'
import { BeaconNodeSpecResults, SyncData } from '../../../src/types/beacon'
import { Diagnostics } from '../../../src/types/diagnostic'
import { UsernameStorage } from '../../../src/types/storage'
import addClassString from '../../../utilities/addClassString'

export interface MainProps {
  initNodeHealth: Diagnostics
  initSyncData: SyncData
  beaconSpec: BeaconNodeSpecResults
  bnVersion: string
  lighthouseVersion: string
}

const Main: FC<MainProps> = (props) => {
  const { t } = useTranslation()
  const { initNodeHealth, initSyncData, beaconSpec, lighthouseVersion, bnVersion } = props

  const { SECONDS_PER_SLOT } = beaconSpec
  const { isValidatorError, isBeaconError } = useNetworkMonitor()
  const { mode, toggleUiMode } = useUiMode()
  const [userNameError, setError] = useState<OptionalString>()
  const [username, storeUserName] = useLocalStorage<UsernameStorage>('username', undefined)

  const handleUserNameChange = (e: any) => {
    const value = e.target.value
    setError(undefined)

    if (!value) {
      setError(t('error.userName.required'))
    }

    storeUserName(value)
  }

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

  const svgClasses = addClassString('hidden md:block absolute top-14 right-10', [
    mode === UiMode.DARK ? 'opacity-20' : 'opacity-40',
  ])

  return (
    <DashboardWrapper
      syncData={syncData}
      beaconSpec={beaconSpec}
      isBeaconError={isBeaconError}
      isValidatorError={isValidatorError}
      nodeHealth={nodeHealth}
    >
      <div className='relative w-full max-w-1440 px-5 py-8'>
        <LighthouseSvg className={svgClasses} />
        <div className='relative z-10 w-full pb-20 lg:pb-0'>
          <div className='w-full flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 justify-between pr-12'>
            <Typography type='text-subtitle1' className='capitalize' fontWeight='font-light'>
              {t('sidebar.settings')}
            </Typography>
          </div>
          <div className='w-full flex flex-col lg:flex-row pt-8'>
            <div className='flex-1'>
              <div className='w-full flex flex-col md:flex-row max-w-xl justify-between'>
                <div className='order-2 md:order-1'>
                  <Typography
                    type='text-subtitle2'
                    color='text-transparent'
                    className='primary-gradient-text'
                    fontWeight='font-light'
                  >
                    {t('settings.currentVersion')}
                  </Typography>
                </div>
                <div className='flex order-1 md:order-2 mb-8 md:mb-0 items-center space-x-2'>
                  <Typography
                    type='text-caption1'
                    isBold
                    family='font-archivo'
                    color='text-dark500'
                    className='uppercase'
                  >
                    {t('sidebar.theme')}
                  </Typography>
                  <UiModeIcon mode={mode} />
                  <Toggle id='uiModeToggle' value={mode === UiMode.DARK} onChange={toggleUiMode} />
                </div>
              </div>
              <AppVersion bnVersion={bnVersion} vcVersion={lighthouseVersion} className='mt-4' />
            </div>
            <div className='flex-1 mt-8 lg:mt-0 lg:px-12'>
              <AppDescription view='settings' />
              <div className='w-full flex pt-12 justify-between'>
                <SocialIcon
                  href={SigPGithubUrl}
                  darkMode='dark:text-primary'
                  title='GitHub'
                  icon='bi-github'
                  color='text-primary'
                />
                <SocialIcon
                  href={DiscordUrl}
                  darkMode='dark:text-primary'
                  title='Discord'
                  icon='bi-discord'
                  color='text-primary'
                />
                <SocialIcon
                  href={SigPTwitter}
                  darkMode='dark:text-primary'
                  title='Twitter'
                  icon='bi-twitter'
                  color='text-primary'
                />
                <SocialIcon
                  href={SigPIoUrl}
                  darkMode='dark:text-primary'
                  title={t('settings.links.website')}
                  icon='bi-globe2'
                  color='text-primary'
                />
                <SocialIcon
                  href={LighthouseBookUrl}
                  darkMode='dark:text-primary'
                  title={t('settings.links.documentation')}
                  icon='bi-life-preserver'
                  color='text-primary'
                />
              </div>
            </div>
          </div>
          <div className='w-full mt-6 lg:mt-0 px-0'>
            <Typography
              color='text-transparent'
              className='primary-gradient-text'
              fontWeight='font-light'
            >
              {t('settings.general')}
            </Typography>
            <div className='w-full flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-4 pt-8'>
              <Input
                uiMode={mode}
                error={userNameError}
                label={t('configScreen.userNameLabel')}
                className='capitalize max-w-xl pl-4 pt-2'
                onChange={handleUserNameChange}
                value={username}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default Main
