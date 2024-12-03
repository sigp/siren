import { FC } from 'react'
import { ValidatorCandidate } from '../../../../../types'
import IconButton, { IconButtonTypes } from '../../../../IconButton/IconButton'
import ValidatorCandidateRow, {
  ValidatorCandidateRowProps,
} from '../../../../ValidatorCandidateRow/ValidatorCandidateRow'

export interface ValSetupRowProps extends Pick<ValidatorCandidateRowProps, 'onUpdateCandidate'> {
  index: number
  candidate: ValidatorCandidate
  onRemoveCandidate: (id: string) => void
}

const ValSetupRow: FC<ValSetupRowProps> = ({
  index,
  candidate,
  onUpdateCandidate,
  onRemoveCandidate,
}) => {
  const { id } = candidate
  const removeCandidate = () => onRemoveCandidate(id)

  return (
    <ValidatorCandidateRow index={index + 1} data={candidate} onUpdateCandidate={onUpdateCandidate}>
      <div className='flex relative items-center'>
        <div className='p-4 hidden lg:block'>
          <i className='bi-check-circle text-primary' />
        </div>
        <div className='cursor-pointer p-4 border-l-style'>
          <IconButton
            buttonType={IconButtonTypes.TERTIARY}
            onClick={removeCandidate}
            icon='bi-dash-circle'
          />
        </div>
      </div>
    </ValidatorCandidateRow>
  )
}

export default ValSetupRow
