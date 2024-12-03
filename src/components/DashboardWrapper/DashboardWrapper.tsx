import React, { FC, MutableRefObject, ReactNode, useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import addClassString from '../../../utilities/addClassString'
import { Storage } from '../../constants/enums'
import useLocalStorage from '../../hooks/useLocalStorage'
import useUiMode from '../../hooks/useUiMode'
import { beaconNodeSpec } from '../../recoil/atoms'
import { ActivityResponse } from '../../types'
import { BeaconNodeSpecResults, SyncData } from '../../types/beacon'
import { Diagnostics } from '../../types/diagnostic'
import { UiThemeStorage } from '../../types/storage'
import ConnectWalletModal from '../ConnectWalletModal/ConnectWalletModal'
import FootBar from '../FootBar/FootBar'
import NetworkErrorModal from '../NetworkErrorModal/NetworkErrorModal'
import SideBar from '../SideBar/SideBar'
import TopBar from '../TopBar/TopBar'

export interface DashboardWrapperProps {
  children: ReactNode | ReactNode[]
  isBeaconError: boolean
  isValidatorError: boolean
  beaconSpec: BeaconNodeSpecResults
  nodeHealth: Diagnostics
  syncData: SyncData
  scrollRef?: MutableRefObject<HTMLDivElement | null>
  className?: string
  initActivityData: ActivityResponse
}

const DashboardWrapper: FC<DashboardWrapperProps> = ({
  children,
  isBeaconError,
  isValidatorError,
  nodeHealth,
  syncData,
  beaconSpec,
  scrollRef,
  initActivityData,
  className,
}) => {
  const {
    beaconSync: { isSyncing },
  } = syncData
  const [isReady, setReady] = useState(false)
  const { toggleUiMode } = useUiMode()
  const setBeaconSpec = useSetRecoilState(beaconNodeSpec)
  const [uiThemeStorage] = useLocalStorage<UiThemeStorage>(Storage.UI, undefined)
  const containerClasses = addClassString('flex-1 w-full overflow-scroll', [className])

  useEffect(() => {
    if (isReady) {
      toggleUiMode(uiThemeStorage)
    }

    setReady(true)
  }, [isReady, setReady])

  useEffect(() => {
    setBeaconSpec(beaconSpec)
  }, [beaconSpec, setBeaconSpec])

  return (
    <div className='w-screen h-screen flex overflow-hidden relative'>
      <SideBar />
      <NetworkErrorModal
        isBeaconNetworkError={isBeaconError}
        isValidatorNetworkError={isValidatorError}
      />
      <div className='flex flex-1 flex-col bg-white dark:bg-darkPrimary items-center justify-center'>
        <TopBar initActivityData={initActivityData} beaconSpec={beaconSpec} syncData={syncData} />
        <div ref={scrollRef} className={containerClasses}>
          {children}
        </div>
        <FootBar nodeHealth={nodeHealth} isSyncing={isSyncing} />
      </div>
      <ConnectWalletModal />
    </div>
  )
}

export default DashboardWrapper
