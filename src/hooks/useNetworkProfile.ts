import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { getNetworkProfile, NetworkProfile } from '../../utilities/getNetworkProfile'
import { beaconNodeSpec } from '../recoil/atoms'

export const useNetworkProfile = (): NetworkProfile => {
  const spec = useRecoilValue(beaconNodeSpec)
  return useMemo(() => getNetworkProfile(spec?.CONFIG_NAME), [spec?.CONFIG_NAME])
}
