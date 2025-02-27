import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { HOLESKY_PECTRA_FORK_VERSION, MAINNET_PECTRA_FORK_VERSION } from '../constants/constants'
import { Network } from '../constants/enums'
import { beaconNodeSpec, forkVersion } from '../recoil/atoms'

const useElectraStatus = () => {
  const forkVersionData = useRecoilValue(forkVersion)
  const beaconSpec = useRecoilValue(beaconNodeSpec)

  const isEnabled = useMemo(() => {
    if (!forkVersionData || !beaconSpec) return false
    const { data } = forkVersionData
    const { CONFIG_NAME } = beaconSpec

    const currentVersion = data.current_version
    const configName = CONFIG_NAME.toLowerCase()

    if (
      configName === Network.Mekong.toLowerCase() ||
      configName === Network.Devnet7.toLowerCase()
    ) {
      return true
    }

    if (configName === Network.Holesky.toLowerCase()) {
      return currentVersion === HOLESKY_PECTRA_FORK_VERSION
    }

    return currentVersion === MAINNET_PECTRA_FORK_VERSION
  }, [forkVersionData, beaconSpec])

  return { isEnabled }
}

export default useElectraStatus
