import DeviceHealth from '../../../../../components/HealthCheck/DeviceHealth'
import { Suspense } from 'react'
import NetworkHealth from '../../../../../components/HealthCheck/NetworkHealth'
import HealthOverview from '../../../../../components/HealthCheck/HealthOverview'
import { useSetRecoilState } from 'recoil'
import { onBoardView, setupStep } from '../../../../../recoil/atoms'
import { OnboardView, SetupSteps } from '../../../../../constants/enums'
import useLocalStorage from '../../../../../hooks/useLocalStorage'
import { HealthCheckStorage } from '../../../../../types/storage'
import ValidatorSetupLayout from '../../../../../components/ValidatorSetupLayout/ValidatorSetupLayout'
import { ButtonFace } from '../../../../../components/Button/Button'
import HealthFallBack from '../../../../../components/HealthCheck/HealthFallBack'
import { useTranslation } from 'react-i18next'
import useBeaconHealthPolling from '../../../../../hooks/useBeaconHealthPolling'

const HealthCheck = () => {
  const { t } = useTranslation()
  const setView = useSetRecoilState(onBoardView)
  const setStep = useSetRecoilState(setupStep)
  const [, storeApiToken] = useLocalStorage<string>('api-token', '')
  const [, setHealthChecked] = useLocalStorage<HealthCheckStorage>('health-check', undefined)

  const viewSessionAuth = () => {
    storeApiToken('')
    setView(OnboardView.SESSION)
  }
  const viewSync = () => {
    setHealthChecked(true)
    setStep(SetupSteps.SYNC)
  }

  useBeaconHealthPolling()

  return (
    <ValidatorSetupLayout
      onStepBack={viewSessionAuth}
      onNext={viewSync}
      previousStep={t('sessionAuth')}
      currentStep={t('healthCheck')}
      title={t('vcHealthCheck.title')}
      ctaText={t('continue')}
      ctaIcon='bi-arrow-right'
      ctaType={ButtonFace.SECONDARY}
    >
      <Suspense fallback={<HealthFallBack />}>
        <DeviceHealth />
      </Suspense>
      <Suspense fallback={<HealthFallBack />}>
        <NetworkHealth />
      </Suspense>
      <Suspense fallback={<HealthFallBack size='lg' />}>
        <HealthOverview />
      </Suspense>
    </ValidatorSetupLayout>
  )
}

export default HealthCheck
