import React, { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import postActivity from '../../../utilities/postActivity'
import { Status } from '../../constants/enums'
import useResolveTransactionOnce from '../../hooks/useResolveTransactionOnce'
import { ActivityType, NetworkId, TxHash } from '../../types'
import Tooltip from '../ToolTip/Tooltip'
import TransactionStatus, { TransactionStatusStyle } from '../TransactionStatus/TransactionStatus'
import Typography from '../Typography/Typography'

export interface ConsolidationRequestStatusProps {
  targetPubKey: string
  sourcePubKey: string
  txHash: TxHash
  networkId: NetworkId
  id: number
  onRetryTx: (id: number) => void
  onStatusUpdate?: (id: number, status: Status) => void
}

const ConsolidationRequestStatus: FC<ConsolidationRequestStatusProps> = ({
  targetPubKey,
  sourcePubKey,
  txHash,
  networkId,
  onRetryTx,
  id,
  onStatusUpdate,
}) => {
  const { t } = useTranslation()
  const { txStatus } = useResolveTransactionOnce(txHash)

  useEffect(() => {
    if (txStatus) {
      onStatusUpdate?.(id, txStatus)
    }
  }, [txStatus, id, onStatusUpdate])

  useEffect(() => {
    if (!txStatus || txStatus === Status.PENDING) return
    ;(async () => {
      try {
        await postActivity({
          data: {
            targetPubKey,
            sourcePubKey,
            txHash,
          },
          type: ActivityType.CONSOLIDATION,
          pubKey: targetPubKey,
          status: txStatus,
        })
      } catch (e) {
        console.error('unable to store activity')
      }
    })()
  }, [txStatus, targetPubKey, sourcePubKey, txHash])

  const handleRetry = useCallback(() => onRetryTx(id), [id, onRetryTx])

  const commonProps = {
    id,
    networkId,
    title: t('validatorManagement.consolidateView.signAndSubmit.consolidationRequest'),
    status: txStatus,
    txHash,
    style: TransactionStatusStyle.Secondary,
  }

  if (txStatus === Status.ERROR) {
    return (
      <TransactionStatus {...commonProps}>
        <div className='space-y-2'>
          <Typography type='text-caption1'>
            {t('validatorManagement.consolidateView.signAndSubmit.errorTxText')}
          </Typography>
          <div className='cursor-pointer' onClick={handleRetry}>
            <Typography className='underline' type='text-caption1'>
              {t('validatorManagement.retryTransaction')}
            </Typography>
          </div>
        </div>
      </TransactionStatus>
    )
  }

  if (txStatus === Status.PENDING) {
    return (
      <TransactionStatus {...commonProps}>
        <div className='space-y-2'>
          <Typography type='text-caption1'>
            {t('validatorManagement.consolidateView.signAndSubmit.pendingTxText')}
          </Typography>
          <Tooltip
            id='retryTx-consolidation'
            maxWidth={350}
            text={t('validatorManagement.txStatuses.cancelTxToolTip')}
          >
            <div className='cursor-pointer' onClick={handleRetry}>
              <Typography className='underline' type='text-caption1'>
                {t('cancelTransaction')}
              </Typography>
            </div>
          </Tooltip>
        </div>
      </TransactionStatus>
    )
  }

  return (
    <TransactionStatus
      {...commonProps}
      text={t('validatorManagement.consolidateView.signAndSubmit.successTxText')}
    />
  )
}

export default ConsolidationRequestStatus
