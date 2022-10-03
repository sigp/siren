import { useSetRecoilState } from 'recoil'
import { setupStep } from '../../../../../recoil/atoms'
import { SetupSteps } from '../../../../../constants/enums'
import ValidatorSetupLayout from '../../../../../components/ValidatorSetupLayout/ValidatorSetupLayout'
import SyncCard from '../../../../../components/SyncCard/SyncCard'
import useBeaconSyncInfo from '../../../../../hooks/useBeaconSyncInfo'
import { useMemo } from 'react'
import Typography from '../../../../../components/Typography/Typography'
import secondsToShortHand from '../../../../../utilities/secondsToShortHand'
import ViewDisclosures from '../../../../../components/ViewDisclosures/ViewDisclosures'

const NodeSync = () => {
  const { beaconPercentage, beaconSyncTime, headSlot, slotDistance } = useBeaconSyncInfo()
  const remainingBeaconTime = useMemo<string>(
    () => secondsToShortHand(beaconSyncTime || 0),
    [beaconSyncTime],
  )
  const setStep = useSetRecoilState(setupStep)

  const viewHealth = () => setStep(SetupSteps.HEALTH)

  return (
    <ValidatorSetupLayout
      onNext={viewHealth}
      onStepBack={viewHealth}
      previousStep='Health Check'
      currentStep='Syncing'
      title='Syncing'
      ctaText='Continue'
      mediaQuery='@1200:overflow-hidden @1200:py-0 @1200:px-0 @1024:flex @1024:items-start @1024:justify-center @1200:items-center'
    >
      <div className='w-full flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:space-x-2'>
        <SyncCard
          title='Ethereum Mainnet'
          subTitle='Geth Node'
          timeRemaining='0H 0M'
          status='No connection'
          progress={0}
        />
        <SyncCard
          title='Ethereum Beacon'
          subTitle='Lighthouse Node'
          timeRemaining={remainingBeaconTime}
          status={`${headSlot} / ${slotDistance}`}
          progress={beaconPercentage}
        />
      </div>
      <div className='w-full border border-dark100 mt-4 space-y-4 p-4'>
        <Typography isBold type='text-caption1' className='uppercase'>
          Syncing <br />
          overview —
        </Typography>
        <Typography color='text-dark300'>
          You are currently syncing to the Ethereum Geth and Beacon node. This may take a while...
        </Typography>
        <ViewDisclosures />
      </div>
    </ValidatorSetupLayout>
  )
}

export default NodeSync
