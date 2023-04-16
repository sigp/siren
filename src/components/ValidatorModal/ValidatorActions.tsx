import Typography from '../Typography/Typography'
import DisabledTooltip from '../DisabledTooltip/DisabledTooltip'
import ValidatorCardAction from './ValidatorCardAction'
import { useTranslation } from 'react-i18next'
import { FC, useContext } from 'react'
import { ValidatorModalContext } from './ValidatorModal'
import { useSetRecoilState } from 'recoil'
import { isBlsExecutionModal } from '../../recoil/atoms'

export interface ValidatorActionsProps {
  isConversionRequired?: boolean
}

const ValidatorActions: FC<ValidatorActionsProps> = ({ isConversionRequired }) => {
  const { t } = useTranslation()
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
        <div className='w-full flex items-center px-6 py-8 rounded bg-lightError text-white'>
          <div className='rounded-full mr-14 bg-lightError200 flex-shrink-0 flex items-center justify-center h-12 w-12'>
            <i className='text-2xl bi-exclamation-triangle-fill text-error' />
          </div>
          <div>
            <Typography className='mr-12' type='text-caption1' darkMode='text-dark900'>
              This validator is using old BLS withdrawal credentials. It will not receive regular
              partial withdrawals and cannot be exited. Please convert the withdrawal address to an
              execution address.
              <span className='text-blue-500'>
                <a
                  href='https://launchpad.ethereum.org/en/btec/#generate-json'
                  target='_blank'
                  rel='noreferrer'
                >
                  {' '}
                  Learn more about BLS to Execution here.
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
                Convert withdrawal address.
              </Typography>
            </div>
          </div>
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
