import { formatEther, parseUnits } from 'ethers'
import Link from 'next/link'
import React, { ChangeEvent, FC, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, UseEstimateGasParameters, useSendTransaction } from 'wagmi'
import displayToast from '../../../../../utilities/displayToast'
import formatWithdrawalAddress from '../../../../../utilities/formatWithdrawalAddress'
import getBeaconChaLink from '../../../../../utilities/getBeaconChaLink'
import isValidNetwork from '../../../../../utilities/isValidNetwork'
import postActivity from '../../../../../utilities/postActivity'
import {
  EFFECTIVE_BALANCE,
  EXECUTION_WITHDRAWAL_CONTRACT,
  MAX_EFFECTIVE_BALANCE,
} from '../../../../constants/constants'
import { Status, ValidatorModalView } from '../../../../constants/enums'
import useCalculateGas from '../../../../hooks/useCalculateGas'
import useFeeGetter from '../../../../hooks/useFeeGetter'
import useHasSufficientBalance from '../../../../hooks/useHasSufficientBalance'
import useProcessEffectiveBalance from '../../../../hooks/useProcessEffectiveBalance'
import useResolveTransactionOnce from '../../../../hooks/useResolveTransactionOnce'
import { ActivityType, ToastType, TxHash } from '../../../../types'
import { PartialWithdrawal, ValidatorBalanceInfo, ValidatorInfo } from '../../../../types/validator'
import BasicValidatorMetrics from '../../../BasicValidatorMetrics/BasicValidatorMetrics'
import Button, { ButtonFace } from '../../../Button/Button'
import EffectiveBalanceDisplay from '../../../EffectiveBalanceDisplay/EffectiveBalanceDisplay'
import GradientHeader from '../../../GradientHeader/GradientHeader'
import InfoBox, { InfoBoxType } from '../../../InfoBox/InfoBox'
import Input from '../../../Input/Input'
import TransactionStatusBlock from '../../../TransactionStatus/TransactionStatusBlock'
import Typography from '../../../Typography/Typography'
import WalletActionGuard from '../../../WalletActionGuard/WalletActionGuard'
import ValidatorInfoTable from '../../ValidatorInfoTable'
import { ValidatorModalContext } from '../../ValidatorModal'
import PendingWithdrawalRow from './PendingWithdrawalRow'

export interface ValidatorWithdrawalProps {
  validator: ValidatorInfo
  validatorEpochData: ValidatorBalanceInfo
  partialWithdrawals: PartialWithdrawal[]
  currentEpoch: number
  chainId: number
}

const ValidatorWithdrawal: FC<ValidatorWithdrawalProps> = ({
  validator,
  validatorEpochData,
  chainId,
  currentEpoch,
  partialWithdrawals,
}) => {
  const { t } = useTranslation()
  const { effectiveBalance, balance, withdrawalAddress, pubKey, index } = validator
  const headers = [t('index'), t('amount'), t('withdrawableEpoch'), ' ']
  const [isLoading, setIsLoading] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState<number | undefined>(undefined)
  const sanitizedWithdrawalAmount = withdrawalAmount || 0
  const pendingWithdrawals = partialWithdrawals.filter(
    (withdrawal) => Number(withdrawal.validator_index) === index,
  )
  const formattedWithdrawalAmounts = pendingWithdrawals.length
    ? pendingWithdrawals.reduce(
        (acc, withdrawal) => acc + Number(formatEther(parseUnits(withdrawal.amount, 'gwei'))),
        0,
      )
    : 0
  const newBalance = balance - sanitizedWithdrawalAmount - formattedWithdrawalAmounts
  const { effective } = useProcessEffectiveBalance(newBalance, effectiveBalance)
  const { moveToView } = useContext(ValidatorModalContext)
  const viewDetails = () => moveToView(ValidatorModalView.DETAILS)
  const [txHash, setTxHash] = useState<TxHash | undefined>(undefined)
  const [isRecordedActivity, setIsRecordedActivity] = useState(false)
  const isInvalidWithdrawalInput =
    !withdrawalAmount || withdrawalAmount <= 0 || withdrawalAmount < 0.000000001
  const isInvalidEffectiveBalance = effective < EFFECTIVE_BALANCE
  const isInvalidWithdrawalBalance = newBalance < EFFECTIVE_BALANCE
  const formattedWithdrawalAddress = formatWithdrawalAddress(withdrawalAddress as string)
  const maxEffectiveBalance = withdrawalAddress?.includes('0x02')
    ? MAX_EFFECTIVE_BALANCE
    : EFFECTIVE_BALANCE
  const { address } = useAccount()
  const { requestFee } = useFeeGetter(EXECUTION_WITHDRAWAL_CONTRACT, Boolean(address))
  const submitRequest = useSendTransaction()
  const { txStatus } = useResolveTransactionOnce(txHash)

  useEffect(() => {
    if (txStatus !== Status.PENDING && withdrawalAmount !== undefined) {
      setWithdrawalAmount(undefined)
    }
  }, [txStatus, withdrawalAmount])

  useEffect(() => {
    if (!txStatus || txStatus === Status.PENDING || isRecordedActivity || !withdrawalAmount) return
    ;(async () => {
      try {
        await postActivity({
          data: {
            amount: withdrawalAmount.toString(),
            txHash,
          },
          type: ActivityType.PARTIAL_WITHDRAWAL,
          pubKey,
          status: txStatus,
        })
      } catch (e) {
        console.error('unable to store withdrawal activity...')
      } finally {
        setIsRecordedActivity(true)
      }
    })()
  }, [txStatus, pubKey, withdrawalAmount, txHash, isRecordedActivity])

  const txData = `0x${pubKey.substring(2)}${Math.floor(sanitizedWithdrawalAmount * 1000000000)
    .toString(16)
    .padStart(16, '0')}` as TxHash
  const maxWithdrawal = balance - formattedWithdrawalAmounts - EFFECTIVE_BALANCE

  const setAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const formattedValue = inputValue ? Number(inputValue) : undefined
    setWithdrawalAmount(
      formattedValue
        ? formattedValue < 0
          ? 0
          : formattedValue > balance
            ? balance
            : formattedValue
        : formattedValue,
    )
  }

  const { estimatedGasLimit, totalRequiredFunds } = useCalculateGas({
    chainId,
    config: {
      to: EXECUTION_WITHDRAWAL_CONTRACT,
      value: requestFee,
      data: txData,
    } as UseEstimateGasParameters,
    extraFee: requestFee,
  })

  const { isSufficient } = useHasSufficientBalance(totalRequiredFunds)

  const setMaxAmount = () => setWithdrawalAmount(maxWithdrawal > 0.000000001 ? maxWithdrawal : 0)

  const handleTxError = (e: any) => {
    const error = (e as Error).message
    let errorMessage = 'error.unexpectedPartialWithdrawalError'
    if (error.toLowerCase().includes('user rejected the request')) {
      errorMessage = 'error.userRejectedTransaction'
    }

    displayToast(t(errorMessage), ToastType.ERROR)
  }

  const submitWithdrawal = async () => {
    setIsLoading(false)
    setIsRecordedActivity(false)
    try {
      setIsLoading(true)
      const txHash = await submitRequest.sendTransactionAsync({
        to: EXECUTION_WITHDRAWAL_CONTRACT,
        account: address,
        chainId,
        value: requestFee,
        data: txData,
        gas: estimatedGasLimit,
      })

      setTxHash(txHash)
    } catch (e) {
      handleTxError(e)
    } finally {
      setIsLoading(false)
    }
  }

  const retryTransaction = () => setTxHash(undefined)

  const beaconChaLink = isValidNetwork(chainId)
    ? getBeaconChaLink(chainId, `/validator/${index}#withdrawals`)
    : null

  const withdrawalRequestTableRender = useMemo(() => {
    return (
      <ValidatorInfoTable
        className='mt-10'
        title={t('validatorManagement.partialWithdrawal.pendingWithdrawals')}
        emptyText={t('validatorManagement.partialWithdrawal.noPendingWithdrawalRequests')}
        headers={headers}
      >
        {pendingWithdrawals.map((withdrawal, index) => (
          <PendingWithdrawalRow currentEpoch={currentEpoch} key={index} withdrawal={withdrawal} />
        ))}
      </ValidatorInfoTable>
    )
  }, [t, headers, pendingWithdrawals, currentEpoch])

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='w-full bg-dark25 dark:bg-darkPrimary h-48 relative p-4'>
        <div className='relative z-20 space-x-4 flex items-center'>
          <i onClick={viewDetails} className='bi-chevron-left dark:text-dark300 cursor-pointer' />
          <Typography type='text-subtitle1' fontWeight='font-light'>
            {t('validatorManagement.partialWithdrawal.title')}
          </Typography>
        </div>
        <div className='absolute overflow-hidden z-10 top-0 left-0 w-full h-full'>
          <GradientHeader speed={0.15} name='deposit-gradient-header' className='h-full' isReady />
        </div>
      </div>
      <div className='w-full flex-1 flex flex-col overflow-auto'>
        <div className='w-full flex flex-col lg:flex-row p-4 space-y-4 lg:space-y-0 lg:space-x-4'>
          <div className='w-full lg:w-1/2 order-2 lg:order-1 mt-4 lg:mt-0'>
            {txHash ? (
              <TransactionStatusBlock
                chainId={chainId}
                onErrorText={t('validatorManagement.retryTransaction')}
                onError={retryTransaction}
                onSuccess={viewDetails}
                onSuccessText={t('validatorManagement.viewValidator')}
                txStatus={txStatus}
                txHash={txHash}
              />
            ) : (
              <div className='w-full border border-style p-4 pb-8 space-y-8'>
                <InfoBox
                  type={InfoBoxType.NOTICE}
                  text={t('validatorManagement.partialWithdrawal.helperText')}
                />
                <div className='w-full relative space-y-1'>
                  <Input
                    isErrorBorder={isInvalidEffectiveBalance}
                    value={withdrawalAmount || ''}
                    disabled={isLoading}
                    className='flex-1'
                    min={0}
                    inputStyle='basic_border'
                    type='number'
                    onChange={setAmount}
                  />
                  <div onClick={setMaxAmount}>
                    <Typography
                      color='text-primary'
                      darkMode='dark:text-primary'
                      className='text-right underline cursor-pointer'
                      type='text-tiny'
                    >
                      {t('setMaxAmount')}
                    </Typography>
                  </div>
                </div>
                <WalletActionGuard
                  isSufficientBalance={isSufficient}
                  guardActionClass='w-full'
                  targetAddress={formattedWithdrawalAddress}
                >
                  <Button
                    onClick={submitWithdrawal}
                    isLoading={isLoading}
                    isDisabled={
                      isInvalidWithdrawalInput ||
                      isInvalidEffectiveBalance ||
                      isInvalidWithdrawalBalance ||
                      isLoading
                    }
                    className='w-full'
                    type={ButtonFace.SECONDARY}
                  >
                    {t('validatorManagement.partialWithdrawal.requestWithdrawal')}
                  </Button>
                </WalletActionGuard>
              </div>
            )}
          </div>
          <div className='flex-1 order-1 lg:order-2 space-y-4'>
            <BasicValidatorMetrics validatorEpochData={validatorEpochData} validator={validator} />
            <EffectiveBalanceDisplay
              isFullDisplay
              supplementAmount={-(sanitizedWithdrawalAmount + formattedWithdrawalAmounts)}
              maxEffectiveBalance={maxEffectiveBalance}
              className='p-4 border-style'
              validator={validator}
            />
          </div>
        </div>
        {beaconChaLink ? (
          <Link target='_blank' href={beaconChaLink}>
            {withdrawalRequestTableRender}
          </Link>
        ) : (
          withdrawalRequestTableRender
        )}
      </div>
    </div>
  )
}

export default ValidatorWithdrawal
