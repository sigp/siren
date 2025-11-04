import React, { FC, MutableRefObject, ReactNode, useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import addClassString from '../../../utilities/addClassString'
import { beaconNodeSpec } from '../../recoil/atoms'
import { ActivityResponse } from '../../types'
import { BeaconNodeSpecResults, SyncData } from '../../types/beacon'
import { Diagnostics } from '../../types/diagnostic'
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
  const setBeaconSpec = useSetRecoilState(beaconNodeSpec)
  const containerClasses = addClassString('flex-1 w-full overflow-y-auto overflow-x-hidden', [
    className,
  ])

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
