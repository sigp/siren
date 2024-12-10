import { useMemo } from 'react'
import useAccountBalance from './useAccountBalance'

const useHasSufficientBalance = (amount: bigint) => {
  const { balanceData } = useAccountBalance()

  return useMemo(() => {
    return {
      isSufficient: balanceData ? balanceData.value >= amount : false,
    }
  }, [amount, balanceData])
}

export default useHasSufficientBalance
