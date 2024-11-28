import { FC, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import BeaconSyncCard from '../../../src/components/BeaconSyncCard/BeaconSyncCard'
import SyncDisclosure from '../../../src/components/Disclosures/SyncDisclosure'
import Typography from '../../../src/components/Typography/Typography'
import ValidatorSetupLayout from '../../../src/components/ValidatorSetupLayout/ValidatorSetupLayout'
import ValidatorSyncCard from '../../../src/components/ValidatorSyncCard/ValidatorSyncCard'
import useNetworkMonitor from '../../../src/hooks/useNetworkMonitor'
import useSWRPolling from '../../../src/hooks/useSWRPolling'
import { SetupProps } from '../../../src/types'

export interface MainProps extends Omit<SetupProps, 'initNodeHealth'> {}

const Main: FC<MainProps> = ({ initSyncData, beaconSpec }) => {
  const { t } = useTranslation()

  const { SECONDS_PER_SLOT } = beaconSpec
  const slotInterval = Number(SECONDS_PER_SLOT) * 1000

  const { isValidatorError, isBeaconError } = useNetworkMonitor()
  const networkError = isValidatorError || isBeaconError

  const { data: syncData } = useSWRPolling('/api/node-sync', {
    refreshInterval: slotInterval,
    fallbackData: initSyncData,
    networkError,
  })

  const { beaconSync, executionSync } = syncData

  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  return (
    <div className='relative h-screen w-screen overflow-hidden flex'>
      <ValidatorSetupLayout
        nextUrl='/dashboard'
        prevUrl='/setup/health-check'
        previousStep={t('healthCheck')}
        currentStep={t('syncing')}
        title={t('syncing')}
        ctaText={t('continue')}
        ctaIcon='bi-arrow-right'
        mediaQuery='@1200:overflow-hidden @1200:py-0 @1200:px-0 @1024:flex items-center @1024:justify-center'
      >
        <div className='w-full flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:space-x-2'>
          <ValidatorSyncCard data={executionSync} />
          <BeaconSyncCard data={beaconSync} />
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
    </div>
  )
}

export default Main
