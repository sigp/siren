import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { TxHash } from '../types'

const useFeeGetter = (contractAddress: TxHash, isReady: boolean, bufferAmount: bigint = 0n) => {
  const publicClient = usePublicClient()
  const [requestFee, setRequestFee] = useState<bigint>(0n)

  useEffect(() => {
    async function fetchFee() {
      try {
        if (!publicClient || !isReady || !contractAddress) return

        const feeHex = await publicClient.request({
          method: 'eth_call',
          params: [{ to: contractAddress, data: '0x' }, 'latest'],
        })

        const rawFee = BigInt(feeHex)
        const pct = BigInt(bufferAmount)

        const adjusted = (rawFee * (100n + pct) + (100n - 1n)) / 100n

        setRequestFee(adjusted)
      } catch (error) {
        console.error('Error fetching fee:', error)
      }
    }
    void fetchFee()
  }, [publicClient, contractAddress, isReady, bufferAmount])

  return {
    requestFee,
  }
}

export default useFeeGetter
