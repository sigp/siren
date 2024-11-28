import { useAccount, UseAccountReturnType, useBalance, UseBalanceParameters } from 'wagmi'

export type BalanceReturn = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

export interface UseAccountBalanceResult extends UseAccountReturnType {
  balanceData: BalanceReturn | undefined
}

const useAccountBalance = (props?: UseBalanceParameters): UseAccountBalanceResult => {
  const { query, refetchInterval = 6000 } = props || {}
  const account = useAccount()
  const { address } = account

  const { data } = useBalance({
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
    balanceData: data,
  }
}

export default useAccountBalance
