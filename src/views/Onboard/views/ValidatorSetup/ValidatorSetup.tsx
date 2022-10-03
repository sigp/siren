import HealthCheck from './Steps/HealthCheck'
import { SetupSteps } from '../../../../constants/enums'
import { useRecoilState } from 'recoil'
import { setupStep } from '../../../../recoil/atoms'
import useLocalStorage from '../../../../hooks/useLocalStorage'
import { Suspense, useEffect } from 'react'
import { HealthCheckStorage } from '../../../../types/storage'
import NodeSync from './Steps/NodeSync'

const ValidatorSetup = () => {
  const [view, setView] = useRecoilState(setupStep)
  const [healthCheck] = useLocalStorage<HealthCheckStorage>('health-check', undefined)

  useEffect(() => {
    if (view) return

    if (!healthCheck) {
      setView(SetupSteps.HEALTH)
      return
    }

    setView(SetupSteps.SYNC)
  }, [view, healthCheck])

  switch (view) {
    case SetupSteps.SYNC:
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <NodeSync />
        </Suspense>
      )
    case SetupSteps.HEALTH:
      return <HealthCheck />
    default:
      return null
  }
}

export default ValidatorSetup
