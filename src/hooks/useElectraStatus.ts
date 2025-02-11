import { useMemo } from 'react'
import { useStorageAt } from 'wagmi'
import { CONSOLIDATION_CONTRACT } from '../constants/constants'

const DEFAULT_VALUE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const useElectraStatus = (chainId: number) => {
  const { data, isFetched } = useStorageAt({
    address: CONSOLIDATION_CONTRACT,
    slot: '0x00',
    chainId,
  })

  const isEnabled = useMemo(() => {
    if (!isFetched || !data) return false
    return data !== DEFAULT_VALUE
  }, [isFetched, data])

  return { isEnabled }
}

export default useElectraStatus
