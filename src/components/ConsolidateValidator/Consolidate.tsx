import axios from 'axios'
import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useSendTransaction, UseEstimateGasParameters } from 'wagmi'
import displayToast from '../../../utilities/displayToast'
import formatWithdrawalAddress from '../../../utilities/formatWithdrawalAddress'
import { CONSOLIDATION_CONTRACT } from '../../constants/constants'
import useCalculateGas from '../../hooks/useCalculateGas'
import useHasSufficientBalance from '../../hooks/useHasSufficientBalance'
import { ActivityType, ConsolidationTx, ToastType, TxHash } from '../../types'
import { ValidatorInfo } from '../../types/validator'
import Button, { ButtonFace } from '../Button/Button'
import WalletActionGuard from '../WalletActionGuard/WalletActionGuard'

export interface ConsolidateViewProps {
  targetPubKey: string
  sourceValidator: ValidatorInfo
  queueLength: bigint | TxHash
  chainId: number
  bufferPercentage: bigint
  onSubmitRequest: (request: ConsolidationTx) => void
}

const Consolidate: FC<ConsolidateViewProps> = ({
  targetPubKey,
  sourceValidator,
  chainId,
  queueLength,
  bufferPercentage,
  onSubmitRequest,
}) => {
  const { t } = useTranslation()
  const { index, pubKey: sourcePubKey, withdrawalAddress } = sourceValidator
  const txData = ('0x' + sourcePubKey.substring(2) + targetPubKey.substring(2)) as TxHash
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const submitRequest = useSendTransaction()
  const getRequiredFee = (numerator: bigint, percentage = 0n): bigint => {
    // https://eips.ethereum.org/EIPS/eip-7251#fee-calculation
    let i = 1n
    let output = 0n
    let numeratorAccum = 1n * 17n

    while (numeratorAccum > 0n) {
      output += numeratorAccum
      numeratorAccum = (numeratorAccum * numerator) / (17n * i)
      i += 1n
    }

    const baseFee = output / 17n

    return (baseFee * (100n + BigInt(percentage)) + (100n - 1n)) / 100n
  }
  const requestFee = useMemo(() => {
    if (!queueLength) return 0n

    return getRequiredFee(BigInt(queueLength), bufferPercentage)
  }, [queueLength, bufferPercentage])

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
        pubKey: sourcePubKey,
        txHash,
        status: 'pending',
      })

      try {
        await axios.post('/api/log-activity', {
          data: JSON.stringify({
            targetPubKey,
            sourcePubKey: sourceValidator.pubKey,
            txHash,
          }),
          type: ActivityType.CONSOLIDATION,
          pubKey: targetPubKey,
        })
      } catch (e) {
        console.error('unable to store activity')
      }
    } catch (error) {
      handleTxError(error)
    } finally {
      setIsLoading(false)
    }
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
