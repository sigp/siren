import React, { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import formatEthAddress from '../../../utilities/formatEthAddress'
import getBeaconChaLink from '../../../utilities/getBeaconChaLink'
import isValidNetwork from '../../../utilities/isValidNetwork'
import postActivity from '../../../utilities/postActivity'
import { Status } from '../../constants/enums'
import useImportValidator from '../../hooks/useImportValidator'
import useResolveTransactionOnce from '../../hooks/useResolveTransactionOnce'
import { ActivityType, DepositData, NetworkId, TxHash } from '../../types'
import ExternalLink from '../ExternalLink/ExternalLink'
import Tooltip from '../ToolTip/Tooltip'
import TransactionStatus from '../TransactionStatus/TransactionStatus'
import Typography from '../Typography/Typography'

export interface ValidatorDepositImportProps {
  depositData: DepositData
  mnemonic: string
  onRetryTx: (txHash: TxHash) => void
  onUpdateStatus: (pubKey: string, status: Status) => void
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
  const { txHash, pubKey, mnemonicIndex, amount, keyStorePassword, suggestedFeeRecipient, status } =
    depositData
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
    if (!txStatus || txStatus === Status.PENDING) return
    ;(async () => {
      try {
        await postActivity({
          data: {
            amount: amount.toString(),
            txHash,
          },
          type: ActivityType.DEPOSIT,
          pubKey,
          status: txStatus,
        })
      } catch (e) {
        console.error(e, 'error storing activity')
      }
    })()
  }, [txStatus, txHash, pubKey])

  useEffect(() => {
    if (txStatus === Status.PENDING) return

    if (txStatus === Status.ERROR) {
      onUpdateStatus(pubKey, Status.ERROR)
      return
    }

    if (isImportSuccess) return
    ;(async () => {
      await importValidator({
        mnemonic,
        index: mnemonicIndex,
        keyStorePassword,
        suggestedFeeRecipient,
        onSuccess: () => {
          onUpdateStatus(pubKey, Status.SUCCESS)
        },
        onError: () => {
          onUpdateStatus(pubKey, Status.ERROR)
        },
      })
    })()
  }, [
    txStatus,
    mnemonic,
    mnemonicIndex,
    keyStorePassword,
    suggestedFeeRecipient,
    pubKey,
    isImportSuccess,
  ])

  const beaconChaLink = isValidNetwork(depositNetworkId)
    ? getBeaconChaLink(depositNetworkId, `/validator/${pubKey}`)
    : null

  const renderTransactionStatus = useCallback(() => {
    const commonProps = {
      id: mnemonicIndex,
      networkId: depositNetworkId,
      txHash,
    }

    if (isImportError) {
      return (
        <TransactionStatus
          {...commonProps}
          title={t(`validatorManagement.txStatuses.importError.title`)}
          status={Status.ERROR}
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

    if (isImportSuccess || status === Status.SUCCESS) {
      return (
        <TransactionStatus
          {...commonProps}
          title={t('validatorManagement.txStatuses.validatorComplete.title')}
          status={Status.SUCCESS}
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
          status={Status.PENDING}
          txHash={txHash}
        />
      )
    }

    if (txStatus === Status.ERROR) {
      return (
        <TransactionStatus
          {...commonProps}
          title={t('validatorManagement.txStatuses.error.title')}
          status={txStatus}
        >
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
        </TransactionStatus>
      )
    }

    if (txStatus === Status.PENDING) {
      return (
        <TransactionStatus
          {...commonProps}
          title={t('validatorManagement.txStatuses.pending.title')}
          status={txStatus}
        >
          <div className='space-y-2'>
            <Typography type='text-caption1'>
              {t('validatorManagement.txStatuses.pending.text')}
            </Typography>
            <Tooltip id='retryTx' maxWidth={350} text={t('txStatuses.cancelTxToolTip')}>
              <div className='cursor-pointer' onClick={retryTransaction}>
                <Typography type='text-caption1' className='underline'>
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
        title={t(`validatorManagement.txStatuses.success.title`)}
        text={t(`validatorManagement.txStatuses.success.text`)}
        status={txStatus}
      />
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
