import { useRecoilValue } from 'recoil'
import { useAccount, useSwitchChain } from 'wagmi'
import { beaconNodeSpec } from '../recoil/atoms'
import { Address } from '../types'

export type useWalletConnectionReturnType = {
  isConnected: boolean
  isValidNetwork: boolean
  switchNetwork: () => void
  address: Address
}

const useWalletConnection = (): useWalletConnectionReturnType => {
  const { isConnected, chainId, address } = useAccount()
  const { DEPOSIT_NETWORK_ID } = useRecoilValue(beaconNodeSpec)
  const { switchChain } = useSwitchChain()

  const switchNetwork = () => switchChain({ chainId: Number(DEPOSIT_NETWORK_ID) })

  return {
    isConnected,
    switchNetwork,
    address,
    isValidNetwork: Number(DEPOSIT_NETWORK_ID) === chainId,
  }
}

export default useWalletConnection
