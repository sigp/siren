import { FC, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import useResolveTransactionOnce from '../../hooks/useResolveTransactionOnce'
import { NetworkId, TxHash, TxStatus } from '../../types'
import TransactionStatus, { TransactionStatusStyle } from '../TransactionStatus/TransactionStatus'
import Typography from '../Typography/Typography'

interface ResolvedTransactionStatusProps {
  title: string
  networkId: number
  txHash: TxHash
  id?: string | number
  onStatusUpdate?: (id: string | number, status: TxStatus) => void
  onRetryTx: (id: string | number) => void
  successText: string
  errorText: string
  pendingText: string
}

const ResolvedTransactionStatus: FC<ResolvedTransactionStatusProps> = ({
  title,
  networkId,
  txHash,
  id,
  onStatusUpdate,
  onRetryTx,
  successText,
  pendingText,
  errorText,
}) => {
  const { t } = useTranslation()
  const { txStatus } = useResolveTransactionOnce(txHash)

  useEffect(() => {
    if (txStatus && id != null) {
      onStatusUpdate?.(id, txStatus)
    }
  }, [txStatus, id, onStatusUpdate])

  const renderText = useCallback(
    (status: TxStatus): string => {
      switch (status) {
        case 'success':
          return successText
        case 'error':
          return errorText
        default:
          return pendingText
      }
    },
    [successText, errorText, pendingText],
  )

  const handleRetry = useCallback(() => {
    if (id != null) {
      onRetryTx(id)
    }
  }, [id, onRetryTx])

  if (!txStatus) return null

  if (txStatus === 'error') {
    return (
      <TransactionStatus
        id={id}
        networkId={networkId as NetworkId}
        title={title}
        status={txStatus}
        txHash={txHash}
        style={TransactionStatusStyle.Secondary}
      >
        <div className='space-y-2'>
          <Typography type='text-caption1'>{renderText(txStatus)}</Typography>
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
      title={title}
      text={renderText(txStatus)}
      status={txStatus}
      txHash={txHash}
      style={TransactionStatusStyle.Secondary}
    />
  )
}

export default ResolvedTransactionStatus
