import { useAccount, UseAccountReturnType, useBalance, UseBalanceParameters } from 'wagmi'
import { ChainWithIcon } from '../types/wallet'

export type BalanceReturn = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

export interface useAccountBalanceParameters extends UseBalanceParameters {
  refetchInterval?: number | undefined
}

export interface UseAccountBalanceResult extends Omit<UseAccountReturnType, 'address' | 'chain'> {
  chain?: ChainWithIcon
  address?: string | undefined
  balanceData: BalanceReturn | undefined
}

const useAccountBalance = (props?: useAccountBalanceParameters): UseAccountBalanceResult => {
  const { query, refetchInterval = 6000 } = props || {}
  const account = useAccount()
  const { address, chain } = account

  const { data: balanceData } = useBalance({
    ...props,
    address,
    query: {
      ...query,
      enabled: Boolean(address),
      refetchInterval,
    },
  })

  return {
    ...account,
    chain: chain as ChainWithIcon,
    balanceData,
  }
}

export default useAccountBalance
