import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import LightHouseFullLogo from '../../assets/images/lightHouseFull.svg'
import SlasherLogo from '../../assets/images/slasher.svg'
import { isSideBarOpen } from '../../recoil/atoms'
import { ActivityResponse } from '../../types'
import { BeaconNodeSpecResults, SyncData } from '../../types/beacon'
import ActivityHistory from '../ActivityHistory/ActivityHistory'
import BeaconNetwork from '../BeaconNetwork/BeaconNetwork'
import Button, { ButtonFace } from '../Button/Button'
import Typography from '../Typography/Typography'
import WalletProvider from '../Wallet/WalletProvider'
import BeaconMetric from './BeaconMetric'
import ValidatorMetric from './ValidatorMetric'

export interface TopBarProps {
  syncData: SyncData
  beaconSpec: BeaconNodeSpecResults
  initActivityData: ActivityResponse
}

const TopBar: FC<TopBarProps> = ({ syncData, beaconSpec, initActivityData }) => {
  const { t } = useTranslation()
  const { DEPOSIT_NETWORK_ID } = beaconSpec
  const toggleSideBar = useSetRecoilState(isSideBarOpen)
  const { beaconSync, executionSync } = syncData
  const openSideBar = () => toggleSideBar(true)

  return (
    <div className='w-full z-[60] lg:h-14 @1540:h-18 border-b bg-white dark:bg-dark750 border-borderLight dark:border-dark800 flex justify-between'>
      <div className='flex h-full'>
        <div className='flex items-center md:w-42 lg:border-r border-borderLight dark:border-borderDark px-4'>
          <div
            onClick={openSideBar}
            className='w-full h-full flex md:hidden items-center justify-center cursor-pointer'
          >
            <i className='bi-list text-dark900 dark:text-dark300 text-2xl' />
          </div>
          <LightHouseFullLogo className='hidden w-full lg:flex text-black dark:text-white' />
        </div>
        <div className='hidden lg:flex h-full'>
          <ValidatorMetric data={executionSync} />
          <BeaconMetric data={beaconSync} />
          <div className='hidden w-24 border-r border-borderLight dark:border-dark800 p-2'>
            <div className='flex-1 space-y-2'>
              <Typography family='font-roboto' type='text-tiny'>
                {t('slasher')}
              </Typography>
              <Typography
                color='text-primary'
                darkMode='dark:text-white'
                isBold
                type='text-caption1'
                family='font-roboto'
              >
                {t('live')}
              </Typography>
            </div>
            <SlasherLogo className='w-6 h-6 text-primary' />
          </div>
          <BeaconNetwork />
        </div>
      </div>
      <div className='h-full py-4 lg:py-0 flex'>
        <WalletProvider beaconSpec={beaconSpec} />
        <div className='flex h-full'>
          <ActivityHistory
            depositNetworkId={DEPOSIT_NETWORK_ID}
            initActivityData={initActivityData}
          />
          <div className='border-l-style flex items-center'>
            <div className='opacity-30'>
              <Button
                isDisabled
                className='hidden md:block items-center dark:border-borderDark'
                type={ButtonFace.ICON}
              >
                <i className='bi bi-bell-fill text-2xl text-dark300' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
