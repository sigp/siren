import React, { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import postActivity from '../../../utilities/postActivity'
import { Status } from '../../constants/enums'
import useResolveTransactionOnce from '../../hooks/useResolveTransactionOnce'
import { ActivityType, NetworkId, TxHash } from '../../types'
import TransactionStatus, { TransactionStatusStyle } from '../TransactionStatus/TransactionStatus'
import Typography from '../Typography/Typography'

export interface ConsolidationRequestStatusProps {
  targetPubKey: string
  sourcePubKey: string
  txHash: TxHash
  networkId: number
  id?: string | number
  onRetryTx: (id: string | number) => void
  onStatusUpdate?: (id: string | number, status: Status) => void
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

  const renderText = {
    [Status.SUCCESS]: 'successTxText',
    [Status.ERROR]: 'errorTxText',
    [Status.PENDING]: 'pendingTxText',
  }[txStatus]

  useEffect(() => {
    if (txStatus && id != null) {
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
      } catch (_) {
        console.error('unable to store activity')
      }
    })()
  }, [txStatus, targetPubKey, sourcePubKey, txHash])

  const handleRetry = useCallback(() => {
    if (id != null) {
      onRetryTx(id)
    }
  }, [id, onRetryTx])

  if (txStatus === Status.ERROR) {
    return (
      <TransactionStatus
        id={id}
        networkId={networkId as NetworkId}
        title={t('validatorManagement.consolidateView.signAndSubmit.consolidationRequest')}
        status={txStatus}
        txHash={txHash}
        style={TransactionStatusStyle.Secondary}
      >
        <div className='space-y-2'>
          <Typography type='text-caption1'>
            {t(`validatorManagement.consolidateView.signAndSubmit.${renderText}`)}
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

  return (
    <TransactionStatus
      id={id}
      networkId={networkId as NetworkId}
      title={t('validatorManagement.consolidateView.signAndSubmit.consolidationRequest')}
      text={t(`validatorManagement.consolidateView.signAndSubmit.${renderText}`)}
      status={txStatus}
      txHash={txHash}
      style={TransactionStatusStyle.Secondary}
    />
  )
}

export default ConsolidationRequestStatus
