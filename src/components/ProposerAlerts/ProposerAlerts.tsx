import { FC } from 'react'
import { ProposerDuty } from '../../types'
import groupArray from '../../utilities/groupArray'
import AlertGroup from './AlertGroup'
import ProposalAlert from './ProposalAlert'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { selectGenesisBlock } from '../../recoil/selectors/selectGenesisBlock'
import { selectBnSpec } from '../../recoil/selectors/selectBnSpec'
import { proposerDuties } from '../../recoil/atoms'
import getSlotTimeData from '../../utilities/getSlotTimeData'

export interface ProposerAlertsProps {
  duties: ProposerDuty[]
}

const ProposerAlerts: FC<ProposerAlertsProps> = ({ duties }) => {
  const { SECONDS_PER_SLOT } = useRecoilValue(selectBnSpec)
  const genesis = useRecoilValue(selectGenesisBlock) as number
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
              onClick={removeAlert}
              genesis={genesis}
              secondsPerSlot={SECONDS_PER_SLOT}
              duties={group}
              key={index}
            />
          ))
        : duties.map((duty, index) => {
            const { isFuture, shortHand } = getSlotTimeData(
              Number(duty.slot),
              genesis,
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
