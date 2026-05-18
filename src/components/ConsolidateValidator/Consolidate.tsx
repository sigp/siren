import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, UseEstimateGasParameters, useSendTransaction } from 'wagmi'
import displayToast from '../../../utilities/displayToast'
import formatWithdrawalAddress from '../../../utilities/formatWithdrawalAddress'
import { CONSOLIDATION_CONTRACT } from '../../constants/constants'
import { Status } from '../../constants/enums'
import useCalculateGas from '../../hooks/useCalculateGas'
import useFeeGetter from '../../hooks/useFeeGetter'
import useHasSufficientBalance from '../../hooks/useHasSufficientBalance'
import { useNetworkProfile } from '../../hooks/useNetworkProfile'
import { ConsolidationTx, ToastType, TxHash } from '../../types'
import { ValidatorInfo } from '../../types/validator'
import Button, { ButtonFace } from '../Button/Button'
import UnsupportedNetworkNotice from '../UnsupportedNetworkNotice/UnsupportedNetworkNotice'
import WalletActionGuard from '../WalletActionGuard/WalletActionGuard'

export interface ConsolidateViewProps {
  targetPubKey: string
  sourceValidator: ValidatorInfo
  chainId: number
  bufferPercentage: bigint
  onSubmitRequest: (request: ConsolidationTx) => void
}

const Consolidate: FC<ConsolidateViewProps> = ({
  targetPubKey,
  sourceValidator,
  chainId,
  bufferPercentage,
  onSubmitRequest,
}) => {
  const { t } = useTranslation()
  const profile = useNetworkProfile()
  const { index, pubKey: sourcePubKey, withdrawalAddress } = sourceValidator
  const txData = ('0x' + sourcePubKey.substring(2) + targetPubKey.substring(2)) as TxHash
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const submitRequest = useSendTransaction()
  const { requestFee } = useFeeGetter(CONSOLIDATION_CONTRACT, Boolean(address), bufferPercentage)

  const { estimatedGasLimit, totalRequiredFunds } = useCalculateGas({
    chainId,
    config: {
      to: CONSOLIDATION_CONTRACT,
      value: requestFee,
      data: txData,
    } as UseEstimateGasParameters,
    extraFee: requestFee,
  })

  const { isSufficient } = useHasSufficientBalance(totalRequiredFunds)

  const formattedWithdrawalAddress = formatWithdrawalAddress(withdrawalAddress as string)

  const handleTxError = (e: any) => {
    const error = (e as Error).message
    let errorMessage = 'error.unexpectedConsolidationError'
    if (error.toLowerCase().includes('user rejected the request')) {
      errorMessage = 'error.userRejectedTransaction'
    }

    displayToast(t(errorMessage), ToastType.ERROR)
  }

  const submitConsolidation = async () => {
    setIsLoading(true)
    try {
      const txHash = await submitRequest.sendTransactionAsync({
        to: CONSOLIDATION_CONTRACT,
        account: address,
        chainId,
        value: requestFee,
        data: txData,
        gas: estimatedGasLimit,
      })
      onSubmitRequest({
        index,
        targetPubKey,
        pubKey: sourcePubKey,
        txHash,
        status: Status.PENDING,
      })
    } catch (error) {
      handleTxError(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!profile.isWriteSupported) {
    return (
      <UnsupportedNetworkNotice
        action={t('validatorManagement.actions.consolidate')}
        symbol={profile.nativeSymbol}
      />
    )
  }

  return (
    <WalletActionGuard
      isSufficientBalance={isSufficient}
      targetAddress={formattedWithdrawalAddress}
    >
      <Button
        className='w-full md:w-auto'
        isLoading={isLoading}
        type={ButtonFace.SECONDARY}
        onClick={submitConsolidation}
      >
        {t('validatorManagement.consolidateView.signAndSubmit.submitRequest')}
      </Button>
    </WalletActionGuard>
  )
}

export default Consolidate
