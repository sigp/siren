import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import formatUniqueObjectArray from '../../utilities/formatUniqueObjectArray'
import { slotsInEpoc } from '../constants/constants'
import { activeDevice, beaconSyncInfo, proposerDuties } from '../recoil/atoms'
import { selectActiveValidators } from '../recoil/selectors/selectActiveValidators'
import { selectBnSpec } from '../recoil/selectors/selectBnSpec'
import { PollingOptions, ProposerDuty } from '../types'
import usePollApi from './usePollApi'

const useProposerDutiesPolling = (options?: PollingOptions) => {
  const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)
  const { beaconUrl } = useRecoilValue(activeDevice)
  const activeVals = useRecoilValue(selectActiveValidators)
  const activeIds = activeVals.map(({ index }) => index)
  const { head_slot } = useRecoilValue(beaconSyncInfo) || {}
  const time = ((SECONDS_PER_SLOT * slotsInEpoc) / 2) * 1000
  const closestEpoch = head_slot ? Math.floor(head_slot / slotsInEpoc) + 1 : undefined
  const url = `${beaconUrl}/eth/v1/validator/duties/proposer/${closestEpoch}`
  const setDuties = useSetRecoilState(proposerDuties)

  const { data } = usePollApi({
    key: 'validatorProposerDuties',
    time,
    isReady: !!closestEpoch && options?.isReady,
    url,
  })

  useEffect(() => {
    const duties = data?.data

    if (duties && activeIds?.length) {
      setDuties((prev) =>
        formatUniqueObjectArray([
          ...prev,
          ...duties
            .filter((duty: ProposerDuty) => activeIds.includes(duty.validator_index))
            .map((duty: ProposerDuty) => ({
              ...duty,
              uuid: `${duty.slot}${duty.validator_index}`,
            })),
        ]),
      )
    }
  }, [data, activeIds?.length])
}

export default useProposerDutiesPolling
