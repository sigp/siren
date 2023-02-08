import { useRecoilValue } from 'recoil'
import { beaconSyncInfo } from '../recoil/atoms'
import { slotsInEpoc } from '../constants/constants'
import { useEffect, useState } from 'react'
import { fetchValidatorInclusion } from '../api/beacon'
import { selectBeaconUrl } from '../recoil/selectors/selectBeaconUrl'
import { BeaconValidatorInclusionResults } from '../types/beacon'

const useParticipationRate = () => {
  const { head_slot } = useRecoilValue(beaconSyncInfo) || {}
  const url = useRecoilValue(selectBeaconUrl)
  const [isInsufficientData, setError] = useState(false)
  const closestEpochSlot = head_slot ? Math.floor(head_slot / slotsInEpoc) - 1 : undefined
  const [vcInclusionData, setData] = useState<BeaconValidatorInclusionResults | undefined>()

  const fetchInclusion = async (url: string, epoch: number) => {
    try {
      setError(false)
      const { data } = await fetchValidatorInclusion(url, epoch >= 0 ? epoch : 0)
      if (data) {
        setData(data.data)
      }
    } catch (e: any) {
      if (e?.response?.data?.message.includes('NOT_FOUND: beacon state')) {
        setError(true)
      }
    }
  }

  useEffect(() => {
    if (closestEpochSlot !== undefined && url) {
      void fetchInclusion(url, closestEpochSlot)
    }
  }, [closestEpochSlot, url])

  const { previous_epoch_head_attesting_gwei, previous_epoch_active_gwei } = vcInclusionData || {}

  return {
    isInsufficientData,
    rate:
      previous_epoch_head_attesting_gwei && previous_epoch_active_gwei
        ? Math.round((previous_epoch_head_attesting_gwei / previous_epoch_active_gwei) * 100)
        : undefined,
  }
}

export default useParticipationRate
