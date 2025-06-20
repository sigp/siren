import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Status } from '../../../../../../../constants/enums'
import { NetworkId, TxHash } from '../../../../../../../types'
import Button, { ButtonFace } from '../../../../../../Button/Button'
import Tooltip from '../../../../../../ToolTip/Tooltip'
import TransactionStatus from '../../../../../../TransactionStatus/TransactionStatus'
import Typography from '../../../../../../Typography/Typography'

export interface ValidateTransactionStepProps {
  txStatus: Status
  txHash: TxHash | undefined
  networkId: NetworkId
  onRetry: () => void
}

const ValidateTransactionStep: FC<ValidateTransactionStepProps> = ({
  txStatus,
  txHash,
  networkId,
  onRetry,
}) => {
  const { t } = useTranslation()
  const isPending = txStatus === Status.PENDING
  const isError = txStatus === Status.ERROR
  const transKeyStatus = txStatus.toLowerCase()

  return txHash ? (
    <div className='p-4 space-y-2'>
      <TransactionStatus
        title={t(`validatorManagement.txStatuses.${transKeyStatus}.title`)}
        text={!isError ? t(`validatorManagement.txStatuses.${transKeyStatus}.text`) : ''}
        networkId={networkId}
        status={txStatus}
        txHash={txHash}
      >
        {isError && (
          <div className='space-y-2'>
            <Typography type='text-caption1'>
              {t('validatorManagement.txStatuses.error.text')}
            </Typography>
            <div onClick={onRetry} className='cursor-pointer'>
              <Typography type='text-caption1' className='underline'>
                {t('validatorManagement.retryTransaction')}
              </Typography>
            </div>
          </div>
        )}
        {isPending && (
          <div className='space-y-8'>
            <Typography type='text-caption1'>
              {t('validatorManagement.txStatuses.pending.text')}
            </Typography>
            <Tooltip id='retryTx-validate' maxWidth={350} text={t('txStatuses.cancelTxToolTip')}>
              <Button fontType='text-caption1' onClick={onRetry} type={ButtonFace.TERTIARY}>
                {t('cancelTransaction')}
              </Button>
            </Tooltip>
          </div>
        )}
      </TransactionStatus>
    </div>
  ) : null
}

export default ValidateTransactionStep
