import { useRouter } from 'next/navigation'
import { FC, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import { WithdrawalInfoLink } from '../../constants/constants'
import { ValidatorModalView } from '../../constants/enums'
import { isBlsExecutionModal } from '../../recoil/atoms'
import DisabledTooltip from '../DisabledTooltip/DisabledTooltip'
import InfoBox, { InfoBoxType } from '../InfoBox/InfoBox'
import Typography from '../Typography/Typography'
import ValidatorCardAction from './ValidatorCardAction'
import { ValidatorModalContext } from './ValidatorModal'

export interface ValidatorActionsProps {
  isConversionRequired?: boolean
  isProcessing?: boolean
  isExitAction?: boolean
}

const ValidatorActions: FC<ValidatorActionsProps> = ({
  isConversionRequired,
  isProcessing,
  isExitAction = true,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const toggleBlsModal = useSetRecoilState(isBlsExecutionModal)
  const { closeModal, moveToView } = useContext(ValidatorModalContext)
  const viewExitAction = () => moveToView(ValidatorModalView.EXIT)
  const viewBlsModal = () => {
    closeModal()
    setTimeout(() => {
      toggleBlsModal(true)
      router.push('/dashboard/validators?view=bls')
    }, 200)
  }

  return (
    <div className='w-full border-t-style100 space-y-4 p-4'>
      <Typography type='text-caption1'>{t('validatorManagement.management')}</Typography>
      {isConversionRequired ? (
        <InfoBox type={isProcessing ? InfoBoxType.INFO : InfoBoxType.WARNING}>
          {isProcessing ? (
            <Typography type='text-caption1' darkMode='text-dark900'>
              {t('blsExecution.warning.processingText')}
            </Typography>
          ) : (
            <div>
              <Typography className='md:mr-12' type='text-caption1' darkMode='text-dark900'>
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
        </InfoBox>
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
          <ValidatorCardAction
            isDisabled={!isExitAction}
            className='w-32 @425:w-36 sm:w-96 mb-2 lg:flex-1'
            onClick={viewExitAction}
            icon='bi-arrow-right-square'
            title={t('validatorManagement.actions.withdrawValidator')}
          />
        </div>
      )}
    </div>
  )
}

export default ValidatorActions
