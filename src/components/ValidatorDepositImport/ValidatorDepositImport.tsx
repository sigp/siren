import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../utilities/displayToast'
import formatEthAddress from '../../../utilities/formatEthAddress'
import getBeaconChaLink from '../../../utilities/getBeaconChaLink'
import { KeyStoreData } from '../../hooks/useLodestarDepositData'
import useResolveTransactionOnce from '../../hooks/useResolveTransactionOnce'
import { DepositData, NetworkId, ToastType, TxHash, TxStatus } from '../../types'
import ExternalLink from '../ExternalLink/ExternalLink'
import TransactionStatus from '../TransactionStatus/TransactionStatus'
import Typography from '../Typography/Typography'

export interface ValidatorDepositImportProps {
  depositData: DepositData
  onRetryTx: (txHash: TxHash) => void
  onUpdateStatus: (pubKey: string, status: TxStatus) => void
  depositNetworkId: NetworkId
}

const ValidatorDepositImport: FC<ValidatorDepositImportProps> = ({
  depositData,
  onRetryTx,
  onUpdateStatus,
  depositNetworkId,
}) => {
  const { t } = useTranslation()
  const { txHash, keyStore, pubKey, mnemonicIndex } = depositData
  const shortHandTxHash = formatEthAddress(txHash)
  const shortHandPubKey = formatEthAddress(pubKey)
  const [isImporting, setIsImporting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [importError, setImportError] = useState(false)
  const { txStatus } = useResolveTransactionOnce(txHash)

  const importValidator = async (keyStore: KeyStoreData) => {
    try {
      const response = await axios.post('/api/validator-import', { data: keyStore })

      if (response.status) {
        setIsSuccess(true)
        onUpdateStatus(pubKey, 'success')
      }
    } catch (e) {
      console.log(e)
      onUpdateStatus(pubKey, 'error')
      setImportError(true)
      displayToast(
        t('validatorManagement.signAndDeposit.unexpectedImportError', {
          txHash: shortHandTxHash,
          pubKey: shortHandPubKey,
        }),
        ToastType.ERROR,
      )
    }
  }

  const retryTransaction = () => onRetryTx(txHash)

  useEffect(() => {
    if (txStatus === 'success' && !!keyStore) {
      ;(async () => {
        setIsImporting(true)
        await importValidator(keyStore)
      })()
    } else if (txStatus === 'error') {
      onUpdateStatus(pubKey, 'error')
    }
  }, [keyStore, txStatus])

  const isValidNetwork =
    depositNetworkId === NetworkId.HOLESKY || depositNetworkId === NetworkId.MAINNET

  const beaconChaLink = isValidNetwork
    ? getBeaconChaLink(depositNetworkId, `/validator/${pubKey}`)
    : `http://127.0.0.1:64498/validator/${pubKey}`

  const renderTransactionStatus = () => {
    switch (true) {
      case isSuccess:
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
      case isImporting:
        return (
          <TransactionStatus
            id={mnemonicIndex}
            networkId={depositNetworkId}
            title={t(
              `validatorManagement.txStatuses.${importError ? 'importError' : 'importPending'}.title`,
            )}
            text={!importError ? t(`validatorManagement.txStatuses.importPending.text`) : undefined}
            status={importError ? 'error' : 'pending'}
            txHash={txHash}
          >
            {importError && (
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
            )}
          </TransactionStatus>
        )
      default:
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
    }
  }

  return <div className='border-style rounded p-4'>{renderTransactionStatus()}</div>
}

export default ValidatorDepositImport
