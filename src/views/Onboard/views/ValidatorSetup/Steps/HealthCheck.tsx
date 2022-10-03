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

const HealthCheck = () => {
  const setView = useSetRecoilState(onBoardView)
  const setStep = useSetRecoilState(setupStep)
  const [, setHealthChecked] = useLocalStorage<HealthCheckStorage>('health-check', undefined)

  const viewConfig = () => setView(OnboardView.CONFIGURE)
  const viewSync = () => {
    setHealthChecked(true)
    setStep(SetupSteps.SYNC)
  }

  return (
    <ValidatorSetupLayout
      onStepBack={viewConfig}
      onNext={viewSync}
      previousStep='Configure'
      currentStep='health check'
      title='Validator Health Check'
      ctaText='Continue'
    >
      <Suspense fallback={<div>Loading...</div>}>
        <DeviceHealth />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <NetworkHealth />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <HealthOverview />
      </Suspense>
    </ValidatorSetupLayout>
  )
}

export default HealthCheck
