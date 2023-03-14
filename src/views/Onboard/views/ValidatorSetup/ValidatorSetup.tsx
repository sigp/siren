import HealthCheck from './Steps/HealthCheck'
import { SetupSteps } from '../../../../constants/enums'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { beaconNetworkError, setupStep, validatorNetworkError } from '../../../../recoil/atoms'
import useLocalStorage from '../../../../hooks/useLocalStorage'
import React, { useEffect } from 'react'
import { HealthCheckStorage } from '../../../../types/storage'
import NodeSync from './Steps/NodeSync'
import useBeaconSyncPolling from '../../../../hooks/useBeaconSyncPolling'
import useValidatorSyncPolling from '../../../../hooks/useValidatorSyncPolling'
import NetworkErrorModal from '../../../../components/NetworkErrorModal/NetworkErrorModal'

const ValidatorSetup = () => {
  const [view, setView] = useRecoilState(setupStep)
  const [healthCheck] = useLocalStorage<HealthCheckStorage>('health-check', undefined)
  useBeaconSyncPolling()
  useValidatorSyncPolling()

  const isBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const isValidatorNetworkError = useSetRecoilState(validatorNetworkError)

  useEffect(() => {
    return () => {
      isBeaconNetworkError(false)
      isValidatorNetworkError(false)
    }
  }, [])

  useEffect(() => {
    if (view) return

    if (!healthCheck) {
      setView(SetupSteps.HEALTH)
      return
    }

    setView(SetupSteps.SYNC)
  }, [view, healthCheck])

  const renderView = () => {
    switch (view) {
      case SetupSteps.SYNC:
        return <NodeSync />
      case SetupSteps.HEALTH:
        return <HealthCheck />
      default:
        return null
    }
  }

  return (
    <>
      <NetworkErrorModal />
      {renderView()}
    </>
  )
}

export default ValidatorSetup
