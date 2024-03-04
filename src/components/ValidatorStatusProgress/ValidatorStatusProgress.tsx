import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import getValidatorStatusStage from '../../../utilities/getValidatorStatusStage'
import { ValidatorStatus } from '../../types/validator'
import Typography from '../Typography/Typography'
import ProgressBar from './ProgressBar'
import ProgressIcon from './ProgressIcon'

export interface ValidatorStatusProgressProps {
  status: ValidatorStatus
}

const ValidatorStatusProgress: FC<ValidatorStatusProgressProps> = ({ status }) => {
  const { t } = useTranslation()
  const stage = getValidatorStatusStage(status)
  const isDeposit = stage >= 1
  const isPending = stage >= 2
  const isActive = stage >= 3
  const isExit = stage >= 4

  return (
    <div className='w-full flex items-center'>
      <div className='flex flex-col items-center'>
        <Typography type='text-caption2' color='text-dark300'>
          <i className='bi-1-circle text-tiny' /> {t('validatorManagement.details.deposit')}
        </Typography>
        <ProgressIcon isActive={isDeposit} className='text-subtitle2' />
      </div>
      <ProgressBar isActive={isDeposit} />
      <div className='flex flex-col items-center'>
        <Typography type='text-caption2' color='text-dark300'>
          <i className='bi-2-circle text-tiny' /> {t('validatorManagement.details.pending')}
        </Typography>
        <ProgressIcon isActive={isPending} className='text-subtitle2' />
      </div>
      <ProgressBar isActive={isPending} />
      <div className='flex flex-col items-center'>
        <Typography type='text-caption2' color='text-dark300'>
          <i className='bi-3-circle text-tiny' /> {t('validatorManagement.details.active')}
        </Typography>
        <ProgressIcon isActive={isActive} className='text-subtitle2' />
      </div>
      <ProgressBar isActive={isExit} />
      <div className='flex flex-col items-center ml-1'>
        <Typography type='text-caption2' color='text-dark300'>
          <i className='bi-4-circle text-tiny' /> {t('validatorManagement.details.exit')}
        </Typography>
        <ProgressIcon isActive={isExit} className='text-subtitle2' />
      </div>
    </div>
  )
}

export default ValidatorStatusProgress
