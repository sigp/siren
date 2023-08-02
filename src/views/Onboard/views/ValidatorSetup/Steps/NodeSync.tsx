import { useRecoilValue, useSetRecoilState } from 'recoil'
import { appView, setupStep } from '../../../../../recoil/atoms'
import { AppView, SetupSteps } from '../../../../../constants/enums'
import ValidatorSetupLayout from '../../../../../components/ValidatorSetupLayout/ValidatorSetupLayout'
import Typography from '../../../../../components/Typography/Typography'
import { Suspense, useEffect } from 'react'
import BeaconSyncCard from '../../../../../components/BeaconSyncCard/BeaconSyncCard'
import SyncCardFallback from '../../../../../components/SyncCard/SyncCardFallback'
import { Trans, useTranslation } from 'react-i18next'
import useBeaconSyncPolling from '../../../../../hooks/useBeaconSyncPolling'
import ValidatorSyncCard from '../../../../../components/ValidatorSyncCard/ValidatorSyncCard'
import { selectBeaconSyncInfo } from '../../../../../recoil/selectors/selectBeaconSyncInfo'
import SyncDisclosure from '../../../../../components/Disclosures/SyncDisclosure'

const NodeSync = () => {
  useBeaconSyncPolling()
  const { t } = useTranslation()
  const setView = useSetRecoilState(appView)
  const setStep = useSetRecoilState(setupStep)
  const beaconHealth = useRecoilValue(selectBeaconSyncInfo)

  useEffect(() => {
    if (beaconHealth.beaconPercentage >= 95) {
      setView(AppView.DASHBOARD)
    }
  }, [beaconHealth])

  const viewHealth = () => setStep(SetupSteps.HEALTH)

  const viewDashBoard = () => setView(AppView.DASHBOARD)

  return (
    <ValidatorSetupLayout
      onNext={viewDashBoard}
      onStepBack={viewHealth}
      previousStep={t('healthCheck')}
      currentStep={t('syncing')}
      title={t('syncing')}
      ctaText={t('continue')}
      ctaIcon='bi-arrow-right'
      mediaQuery='@1200:overflow-hidden @1200:py-0 @1200:px-0 @1024:flex @1024:items-start @1024:justify-center @1200:items-center'
    >
      <div className='w-full flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:space-x-2'>
        <Suspense fallback={<SyncCardFallback />}>
          <ValidatorSyncCard />
        </Suspense>
        <Suspense fallback={<SyncCardFallback />}>
          <BeaconSyncCard />
        </Suspense>
      </div>
      <div className='w-full border border-dark100 mt-4 space-y-4 p-4'>
        <Typography isBold type='text-caption1' className='uppercase'>
          <Trans i18nKey='nodeSync.syncOverview'>
            <br />
          </Trans>{' '}
          —
        </Typography>
        <Typography color='text-dark300'>{t('nodeSync.syncWarning')}</Typography>
        <SyncDisclosure />
      </div>
    </ValidatorSetupLayout>
  )
}

export default NodeSync
