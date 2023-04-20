import Typography from '../Typography/Typography'
import DisabledTooltip from '../DisabledTooltip/DisabledTooltip'
import ValidatorCardAction from './ValidatorCardAction'
import { useTranslation } from 'react-i18next'
import { FC, useContext } from 'react'
import { ValidatorModalContext } from './ValidatorModal'
import { useSetRecoilState } from 'recoil'
import { isBlsExecutionModal } from '../../recoil/atoms'
import { WithdrawalInfoLink } from '../../constants/constants'
import addClassString from '../../utilities/addClassString'

export interface ValidatorActionsProps {
  isConversionRequired?: boolean
  isProcessing?: boolean
}

const ValidatorActions: FC<ValidatorActionsProps> = ({ isConversionRequired, isProcessing }) => {
  const { t } = useTranslation()
  const warningClasses = addClassString('w-full flex items-center px-6 py-8 rounded', [
    isProcessing && 'bg-dark500',
    !isProcessing && 'bg-lightError',
  ])
  const warningIconBackgroundClasses = addClassString(
    'rounded-full mr-14 flex-shrink-0 flex items-center justify-center h-12 w-12',
    [isProcessing && 'bg-dark400', !isProcessing && 'bg-lightError200'],
  )
  const warningIconClasses = addClassString('text-2xl', [
    isProcessing && 'bi-hourglass-split text-dark600',
    !isProcessing && 'bi-exclamation-triangle-fill text-error',
  ])
  const toggleBlsModal = useSetRecoilState(isBlsExecutionModal)
  const { closeModal } = useContext(ValidatorModalContext)
  const viewBlsModal = () => {
    closeModal()
    setTimeout(() => {
      toggleBlsModal(true)
    }, 200)
  }

  return (
    <div className='w-full border-t-style100 space-y-4 p-4'>
      <Typography type='text-caption1'>{t('validatorManagement.title')}</Typography>
      {isConversionRequired ? (
        <div className={warningClasses}>
          <div className={warningIconBackgroundClasses}>
            <i className={warningIconClasses} />
          </div>
          {isProcessing ? (
            <Typography className='mr-12' type='text-caption1' darkMode='text-dark900'>
              {t('blsExecution.warning.processingText')}
            </Typography>
          ) : (
            <div>
              <Typography className='mr-12' type='text-caption1' darkMode='text-dark900'>
                {t('blsExecution.warning.text')}
                <span className='text-blue-500'>
                  <a href={WithdrawalInfoLink} target='_blank' rel='noreferrer'>
                    {' '}
                    {t('blsExecution.warning.learnMore')}
                  </a>
                </span>
              </Typography>
              <div className='w-fit' onClick={viewBlsModal}>
                <Typography
                  className='mt-4 underline cursor-pointer'
                  type='text-caption1'
                  color='text-error'
                  darkMode='text-error'
                >
                  {t('blsExecution.warning.cta')}
                </Typography>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className='w-full flex flex-wrap lg:space-x-3'>
          <DisabledTooltip className='w-32 @425:w-36 sm:w-96 mb-2 lg:flex-1'>
            <ValidatorCardAction
              icon='bi-arrow-down-circle'
              title={t('validatorManagement.actions.depositFunds')}
            />
          </DisabledTooltip>
          <DisabledTooltip className='w-32 @425:w-36 sm:w-96 mb-2 lg:flex-1'>
            <ValidatorCardAction
              icon='bi-key-fill'
              title={t('validatorManagement.actions.backupKeys')}
            />
          </DisabledTooltip>
          <DisabledTooltip className='w-32 @425:w-36 sm:w-96 mb-2 lg:flex-1'>
            <ValidatorCardAction
              icon='bi-power'
              title={t('validatorManagement.actions.stopValidator')}
            />
          </DisabledTooltip>
          <DisabledTooltip className='w-32 @425:w-36 sm:w-96 mb-2 lg:flex-1'>
            <ValidatorCardAction
              icon='bi-arrow-right-square'
              title={t('validatorManagement.actions.exportValidator')}
            />
          </DisabledTooltip>
          <DisabledTooltip className='w-32 @425:w-36 sm:w-96 mb-2 lg:flex-1'>
            <ValidatorCardAction
              icon='bi-arrow-right-square'
              title={t('validatorManagement.actions.exitValidator')}
            />
          </DisabledTooltip>
          <DisabledTooltip className='w-32 @425:w-36 sm:w-96 mb-2 lg:flex-1'>
            <ValidatorCardAction
              icon='bi-arrow-right-square'
              title={t('validatorManagement.actions.withdrawValidator')}
            />
          </DisabledTooltip>
        </div>
      )}
    </div>
  )
}

export default ValidatorActions
