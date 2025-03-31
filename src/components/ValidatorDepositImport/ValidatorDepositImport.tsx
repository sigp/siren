import { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../utilities/formatEthAddress'
import getBeaconChaLink from '../../../utilities/getBeaconChaLink'
import useImportValidator from '../../hooks/useImportValidator'
import useResolveTransactionOnce from '../../hooks/useResolveTransactionOnce'
import { DepositData, NetworkId, TxHash, TxStatus } from '../../types'
import ExternalLink from '../ExternalLink/ExternalLink'
import TransactionStatus from '../TransactionStatus/TransactionStatus'
import Typography from '../Typography/Typography'

export interface ValidatorDepositImportProps {
  depositData: DepositData
  mnemonic: string
  onRetryTx: (txHash: TxHash) => void
  onUpdateStatus: (pubKey: string, status: TxStatus) => void
  depositNetworkId: NetworkId
}

const ValidatorDepositImport: FC<ValidatorDepositImportProps> = ({
  depositData,
  mnemonic,
  onRetryTx,
  onUpdateStatus,
  depositNetworkId,
}) => {
  const { t } = useTranslation()
  const { txHash, pubKey, mnemonicIndex, keyStorePassword, status } = depositData
  const shortHandPubKey = formatEthAddress(pubKey)
  const { txStatus } = useResolveTransactionOnce(txHash)
  const {
    isError: isImportError,
    isLoading: isImportLoading,
    isSuccess: isImportSuccess,
    importValidator,
  } = useImportValidator()

  const retryTransaction = useCallback(() => onRetryTx(txHash), [onRetryTx, txHash])

  useEffect(() => {
    if (txStatus === 'pending') return

    if (txStatus === 'error') {
      onUpdateStatus(pubKey, 'error')
      return
    }

    if (status !== 'pending') return
    ;(async () => {
      await importValidator({
        mnemonic,
        index: mnemonicIndex,
        keyStorePassword,
        onSuccess: () => {
          onUpdateStatus(pubKey, 'success')
        },
        onError: () => {
          onUpdateStatus(pubKey, 'error')
        },
      })
    })()
  }, [txStatus, mnemonic, mnemonicIndex, keyStorePassword, pubKey, status])

  const isValidNetwork =
    depositNetworkId === NetworkId.HOLESKY || depositNetworkId === NetworkId.MAINNET

  const beaconChaLink = isValidNetwork
    ? getBeaconChaLink(depositNetworkId, `/validator/${pubKey}`)
    : null

  const renderTransactionStatus = useCallback(() => {
    if (isImportError) {
      return (
        <TransactionStatus
          id={mnemonicIndex}
          networkId={depositNetworkId}
          title={t(`validatorManagement.txStatuses.importError.title`)}
          status='error'
          txHash={txHash}
        >
          <div className='space-y-2'>
            <Typography type='text-caption1'>
              {t('validatorManagement.txStatuses.importError.text', {
                pubKey: shortHandPubKey,
              })}
            </Typography>
            <ExternalLink
              href={beaconChaLink}
              text={t('validatorManagement.reviewStatus', { pubKey: shortHandPubKey })}
            />
          </div>
        </TransactionStatus>
      )
    }

    if (isImportSuccess || status === 'success') {
      return (
        <TransactionStatus
          id={mnemonicIndex}
          networkId={depositNetworkId}
          title={t('validatorManagement.txStatuses.validatorComplete.title')}
          status='success'
          txHash={txHash}
        >
          <div className='space-y-2'>
            <Typography type='text-caption1'>
              {t('validatorManagement.txStatuses.validatorComplete.text')}
            </Typography>
            <ExternalLink
              href={beaconChaLink}
              text={t('validatorManagement.reviewStatus', { pubKey: shortHandPubKey })}
            />
          </div>
        </TransactionStatus>
      )
    }

    if (isImportLoading) {
      return (
        <TransactionStatus
          id={mnemonicIndex}
          networkId={depositNetworkId}
          title={t(`validatorManagement.txStatuses.importPending.title`)}
          text={t(`validatorManagement.txStatuses.importPending.text`)}
          status='pending'
          txHash={txHash}
        />
      )
    }

    return (
      <TransactionStatus
        id={mnemonicIndex}
        networkId={depositNetworkId}
        title={t(`validatorManagement.txStatuses.${txStatus}.title`)}
        text={t(`validatorManagement.txStatuses.${txStatus}.text`)}
        status={txStatus || 'pending'}
        txHash={txHash}
      >
        {txStatus === 'error' && (
          <div className='space-y-2'>
            <Typography type='text-caption1'>
              {t('validatorManagement.txStatuses.error.text')}
            </Typography>
            <div onClick={retryTransaction} className='cursor-pointer'>
              <Typography type='text-caption1' className='underline'>
                {t('validatorManagement.retryTransaction')}
              </Typography>
            </div>
          </div>
        )}
      </TransactionStatus>
    )
  }, [
    isImportSuccess,
    isImportLoading,
    mnemonicIndex,
    depositNetworkId,
    isImportError,
    status,
    txHash,
    txStatus,
    shortHandPubKey,
    beaconChaLink,
  ])

  return <div className='border-style rounded p-4'>{renderTransactionStatus()}</div>
}

export default ValidatorDepositImport
