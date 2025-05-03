import { FC } from 'react'
import addClassString from '../../../../../../utilities/addClassString'
import formatEthAddress from '../../../../../../utilities/formatEthAddress'
import getBeaconChaLink from '../../../../../../utilities/getBeaconChaLink'
import isValidNetwork from '../../../../../../utilities/isValidNetwork'
import { Status } from '../../../../../constants/enums'
import { NetworkId, ValidatorCandidate } from '../../../../../types'
import ExternalLink from '../../../../ExternalLink/ExternalLink'
import StatusTag from '../../../../StatusTag/StatusTag'
import ValidatorCandidateRow from '../../../../ValidatorCandidateRow/ValidatorCandidateRow'

export interface MnemonicIndexRowProps {
  candidate: ValidatorCandidate
  depositNetworkId: NetworkId
}

const MnemonicIndexRow: FC<MnemonicIndexRowProps> = ({ candidate, depositNetworkId }) => {
  const { isValidIndex, index, pubKey } = candidate
  const isPending = !Boolean(pubKey)
  const containerClasses = addClassString('flex flex-1 items-center', [
    pubKey ? 'justify-between' : 'justify-end',
  ])

  const beaconChaLink = isValidNetwork(depositNetworkId)
    ? getBeaconChaLink(depositNetworkId, `/validator/${pubKey}`)
    : null

  return (
    <ValidatorCandidateRow index={index} data={candidate}>
      <div className={containerClasses}>
        {pubKey && <ExternalLink text={formatEthAddress(pubKey)} href={beaconChaLink} />}
        <div className='px-4'>
          <StatusTag
            status={isPending ? Status.PENDING : isValidIndex ? Status.SUCCESS : Status.ERROR}
          />
        </div>
      </div>
    </ValidatorCandidateRow>
  )
}

export default MnemonicIndexRow
