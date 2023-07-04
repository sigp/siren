import { useRecoilValue } from 'recoil'
import { beaconSyncInfo, activeDevice } from '../recoil/atoms'
import { slotsInEpoc } from '../constants/constants'
import { useEffect, useState } from 'react'
import { fetchValidatorInclusion } from '../api/beacon'
import { BeaconValidatorInclusionResults } from '../types/beacon'
import { StatusColor } from '../types'

const useParticipationRate = () => {
  const { head_slot } = useRecoilValue(beaconSyncInfo) || {}
  const { beaconUrl } = useRecoilValue(activeDevice)
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
    if (closestEpochSlot !== undefined) {
      void fetchInclusion(beaconUrl, closestEpochSlot)
    }
  }, [closestEpochSlot, beaconUrl])

  const { previous_epoch_target_attesting_gwei, previous_epoch_active_gwei } = vcInclusionData || {}

  const ratePercentage =
    previous_epoch_target_attesting_gwei && previous_epoch_active_gwei
      ? Math.round((previous_epoch_target_attesting_gwei / previous_epoch_active_gwei) * 100)
      : undefined

  const getStatus = (rate?: number) => {
    if (!rate) return StatusColor.DARK
    switch (true) {
      case rate >= 95:
        return StatusColor.SUCCESS
      case rate < 95 && rate > 75:
        return StatusColor.WARNING
      default:
        return StatusColor.ERROR
    }
  }

  return {
    isInsufficientData,
    rate: ratePercentage,
    status: getStatus(ratePercentage),
  }
}

export default useParticipationRate
