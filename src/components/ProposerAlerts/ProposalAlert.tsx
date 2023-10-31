import { ProposerDuty, StatusColor } from '../../types'
import { FC } from 'react'
import StatusBar from '../StatusBar/StatusBar'
import Typography from '../Typography/Typography'
import { Trans } from 'react-i18next'

export interface ProposalAlertProps {
  duty: ProposerDuty
  time: string
  isFuture?: boolean
  onDelete?: (uuid: string[]) => void
}

const ProposalAlert: FC<ProposalAlertProps> = ({ duty, time, isFuture, onDelete }) => {
  const { validator_index, slot, uuid } = duty

  const removeAlert = () => onDelete?.([uuid])
  return (
    <div className='w-full @1540:h-22 group border-b-style500 flex justify-between items-center space-x-2 @1540:space-x-4 p-2'>
      <StatusBar count={3} status={StatusColor.SUCCESS} />
      <div className='w-full max-w-tiny @1540:max-w-full'>
        <Typography type='text-caption2'>
          <Trans
            i18nKey={`alertMessages.proposerAlert.${isFuture ? 'future' : 'past'}`}
            values={{ validator_index, slot, time }}
          >
            <span className='font-bold underline' />
          </Trans>
        </Typography>
      </div>
      {onDelete && (
        <i
          onClick={removeAlert}
          className='bi-trash-fill cursor-pointer opacity-0 group-hover:opacity-100 text-dark200 dark:text-dark300'
        />
      )}
    </div>
  )
}

export default ProposalAlert
