import { FC } from 'react'
import { useSetRecoilState } from 'recoil'
import getSlotTimeData from '../../../utilities/getSlotTimeData'
import groupArray from '../../../utilities/groupArray'
import { proposerDuties } from '../../recoil/atoms'
import { ProposerDuty } from '../../types'
import { BeaconNodeSpecResults, SyncData } from '../../types/beacon'
import AlertGroup from './AlertGroup'
import ProposalAlert from './ProposalAlert'

export interface ProposerAlertsProps {
  duties: ProposerDuty[]
  syncData: SyncData
  bnSpec: BeaconNodeSpecResults
}

const ProposerAlerts: FC<ProposerAlertsProps> = ({ duties, bnSpec, syncData }) => {
  const { SECONDS_PER_SLOT } = bnSpec
  const {
    beaconSync: { headSlot },
  } = syncData
  const setProposers = useSetRecoilState(proposerDuties)
  const groups = groupArray(duties, 10)

  const removeAlert = (uuids: string[]) => {
    setProposers((prev) => prev.filter(({ uuid }) => !uuids.includes(uuid)))
  }

  return (
    <>
      {duties.length >= 10
        ? groups.map((group, index) => (
            <AlertGroup
              headSlot={headSlot}
              onClick={removeAlert}
              secondsPerSlot={SECONDS_PER_SLOT}
              duties={group}
              key={index}
            />
          ))
        : duties.map((duty, index) => {
            const { isFuture, shortHand } = getSlotTimeData(
              headSlot,
              Number(duty.slot),
              SECONDS_PER_SLOT,
            )

            return (
              <ProposalAlert
                onDelete={removeAlert}
                isFuture={isFuture}
                time={shortHand}
                key={index}
                duty={duty}
              />
            )
          })}
    </>
  )
}

export default ProposerAlerts
