import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import {
  HOLESKY_PECTRA_FORK_VERSION,
  HOODI_PECTRA_FORK_VERSION,
  MAINNET_PECTRA_FORK_VERSION,
  SEPOLIA_PECTRA_FORK_VERSION,
} from '../constants/constants'
import { Network } from '../constants/enums'
import { beaconNodeSpec, forkVersion } from '../recoil/atoms'

const TESTNET_FORK_VERSION = process.env.NEXT_PUBLIC_TESTNET_PECTRA_FORK_VERSION

const useElectraStatus = () => {
  const forkVersionData = useRecoilValue(forkVersion)
  const beaconSpec = useRecoilValue(beaconNodeSpec)

  const isEnabled = useMemo(() => {
    if (!forkVersionData || !beaconSpec) return false
    const { data } = forkVersionData
    const { CONFIG_NAME } = beaconSpec

    const currentVersion = data.current_version
    const configName = CONFIG_NAME.toLowerCase()

    if (!!TESTNET_FORK_VERSION && configName === Network.LocalTestnet) {
      return currentVersion === TESTNET_FORK_VERSION
    }

    if (configName === Network.Holesky.toLowerCase()) {
      return currentVersion === HOLESKY_PECTRA_FORK_VERSION
    }

    if (configName === Network.Hoodi.toLowerCase()) {
      return currentVersion === HOODI_PECTRA_FORK_VERSION
    }

    if (configName === Network.Sepolia.toLowerCase()) {
      return currentVersion === SEPOLIA_PECTRA_FORK_VERSION
    }

    return currentVersion === MAINNET_PECTRA_FORK_VERSION
  }, [forkVersionData, beaconSpec])

  return { isEnabled }
}

export default useElectraStatus
