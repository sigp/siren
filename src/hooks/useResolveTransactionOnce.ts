import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { TxHash, TxStatus } from '../types'

export type useResolveTransactionOnceReturnType = {
  txStatus: TxStatus | undefined
}

const useResolveTransactionOnce = (
  txHash: TxHash | undefined,
): useResolveTransactionOnceReturnType => {
  const [isEnabledFetch, setIsEnabledFetch] = useState<boolean>(true)
  const {
    isFetched,
    status: txStatus,
    ...rest
  } = useWaitForTransactionReceipt({ hash: txHash, query: { enabled: isEnabledFetch } })

  useEffect(() => {
    if (isFetched) {
      setIsEnabledFetch(false)
    }
  }, [isFetched])

  return {
    ...rest,
    txStatus,
  }
}

export default useResolveTransactionOnce
