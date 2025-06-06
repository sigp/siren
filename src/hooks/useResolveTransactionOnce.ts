import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { Status } from '../constants/enums'
import { TxHash } from '../types'

export type useResolveTransactionOnceReturnType = {
  txStatus: Status
}

const useResolveTransactionOnce = (
  txHash: TxHash | undefined,
): useResolveTransactionOnceReturnType => {
  const [isEnabledFetch, setIsEnabledFetch] = useState<boolean>(true)
  const { isFetched, status, ...rest } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: isEnabledFetch },
  })

  useEffect(() => {
    if (isFetched) {
      setIsEnabledFetch(false)
    }
  }, [isFetched])

  return {
    ...rest,
    txStatus: status.toUpperCase() as Status,
  }
}

export default useResolveTransactionOnce
