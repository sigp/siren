import { useSetRecoilState } from 'recoil'
import {
  activeDevice,
  alertLogs,
  beaconHealthResult,
  beaconNetworkError,
  beaconSyncInfo,
  beaconVersionData,
  dashView,
  deviceSettings,
  sessionAuthErrorCount,
  validatorCacheBalanceResult,
  validatorHealthResult,
  validatorMetrics,
  validatorNetworkError,
  validatorPeerCount,
  validatorStateInfo,
  validatorSyncInfo,
  validatorVersionData,
  validatorAliases,
} from '../recoil/atoms'
import { ContentView } from '../constants/enums'

const useAtomCleanup = () => {
  const setDashView = useSetRecoilState(dashView)
  const setValMetrics = useSetRecoilState(validatorMetrics)
  const setValCache = useSetRecoilState(validatorCacheBalanceResult)
  const setPeerCount = useSetRecoilState(validatorPeerCount)
  const setBeaconHealth = useSetRecoilState(beaconHealthResult)
  const setValHealth = useSetRecoilState(validatorHealthResult)
  const setBeaconVersion = useSetRecoilState(beaconVersionData)
  const setValVersion = useSetRecoilState(validatorVersionData)
  const setValStateInfo = useSetRecoilState(validatorStateInfo)
  const setBeaconSyncInfo = useSetRecoilState(beaconSyncInfo)
  const setValSyncInfo = useSetRecoilState(validatorSyncInfo)
  const setActiveDevice = useSetRecoilState(activeDevice)
  const setDeviceSettings = useSetRecoilState(deviceSettings)
  const isBeaconNetworkError = useSetRecoilState(beaconNetworkError)
  const isValidatorNetworkError = useSetRecoilState(validatorNetworkError)
  const setSessionAuthErrorCount = useSetRecoilState(sessionAuthErrorCount)
  const setAlert = useSetRecoilState(alertLogs)
  const setAliases = useSetRecoilState(validatorAliases)

  const resetDashboardAtoms = () => {
    setDashView(ContentView.MAIN)
    setValMetrics(undefined as any)
    setValCache(undefined)
    setPeerCount(undefined)
    setBeaconHealth(undefined)
    setValHealth(undefined)
    setBeaconVersion(undefined)
    setValVersion(undefined)
    setActiveDevice(undefined as any)
    isBeaconNetworkError(false)
    isValidatorNetworkError(false)
    setSessionAuthErrorCount(0)
    setDeviceSettings(undefined as any)
    setValSyncInfo(undefined as any)
    setBeaconSyncInfo(undefined as any)
    setValStateInfo(undefined)
    setAlert([])
    setAliases(undefined)
  }

  return {
    resetDashboardAtoms,
  }
}

export default useAtomCleanup
