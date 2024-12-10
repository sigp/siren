import { useRecoilValue } from 'recoil'
import { useAccount, useSwitchChain } from 'wagmi'
import { beaconNodeSpec } from '../recoil/atoms'

export type useWalletConnectionReturnType = {
  isConnected: boolean
  isValidNetwork: boolean
  switchNetwork: () => void
}

const useWalletConnection = (): useWalletConnectionReturnType => {
  const { isConnected, chainId } = useAccount()
  const { DEPOSIT_NETWORK_ID } = useRecoilValue(beaconNodeSpec)
  const { switchChain } = useSwitchChain()

  const switchNetwork = () => switchChain({ chainId: Number(DEPOSIT_NETWORK_ID) })

  return {
    isConnected,
    switchNetwork,
    isValidNetwork: Number(DEPOSIT_NETWORK_ID) === chainId,
  }
}

export default useWalletConnection
