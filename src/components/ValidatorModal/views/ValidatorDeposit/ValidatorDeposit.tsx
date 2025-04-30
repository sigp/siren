import { formatUnits, parseEther } from 'ethers'
import Link from 'next/link'
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import displayToast from '../../../../../utilities/displayToast'
import getBeaconChaLink from '../../../../../utilities/getBeaconChaLink'
import isValidNetwork from '../../../../../utilities/isValidNetwork'
import { EFFECTIVE_BALANCE, MAX_EFFECTIVE_BALANCE } from '../../../../constants/constants'
import { ValidatorModalView, WalletPrefix } from '../../../../constants/enums'
import useHasSufficientBalance from '../../../../hooks/useHasSufficientBalance'
import useProcessEffectiveBalance from '../../../../hooks/useProcessEffectiveBalance'
import useResolveTransactionOnce from '../../../../hooks/useResolveTransactionOnce'
import useValidatorTopUp from '../../../../hooks/useValidatorTopUp'
import { selectUpOffset } from '../../../../recoil/selectors/selectUpOffset'
import { ToastType } from '../../../../types'
import { PendingDeposit, ValidatorBalanceInfo, ValidatorInfo } from '../../../../types/validator'
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
import ValidatorPendingDepositRow from './ValidatorPendingDepositRow'

export interface ValidatorDepositProps {
  validator: ValidatorInfo
  chainId: number
  pendingDeposits: PendingDeposit[]
  headSlot: number
  validatorEpochData: ValidatorBalanceInfo
}

const ValidatorDeposit: FC<ValidatorDepositProps> = ({
  validator,
  validatorEpochData,
  pendingDeposits,
  headSlot,
  chainId,
}) => {
  const { t } = useTranslation()
  const upOffsetAmount = useRecoilValue(selectUpOffset)
  const headers = ['pubkey', t('amount'), t('slot'), ' ']
  const { pubKey, effectiveBalance, withdrawalAddress, balance, index } = validator
  const maxEffectiveBalance = withdrawalAddress?.includes('0x02')
    ? MAX_EFFECTIVE_BALANCE
    : EFFECTIVE_BALANCE

  const filteredDeposits = useMemo(() => {
    return pendingDeposits.filter((deposit) => deposit.pubkey === pubKey)
  }, [pendingDeposits, pubKey])

  const pendingDepositAmount = Number(
    formatUnits(
      filteredDeposits.reduce((acc, deposit) => Number(acc) + Number(deposit.amount), 0),
      'gwei',
    ),
  )

  const [depositAmount, setDepositAmount] = useState<number | undefined>(undefined)

  const { moveToView } = useContext(ValidatorModalContext)
  const viewDetails = () => moveToView(ValidatorModalView.DETAILS)
  const credentialPrefix = Number(withdrawalAddress?.slice(0, 4))
  const sanitizedDepositAmount = depositAmount || 0
  const newBalance = balance + sanitizedDepositAmount + pendingDepositAmount

  const { effective } = useProcessEffectiveBalance(newBalance, effectiveBalance)
  const { isLoading, txHash, error, makeDeposit, retryTransaction } = useValidatorTopUp()
  const { txStatus } = useResolveTransactionOnce(txHash)

  useEffect(() => {
    const finalTxStatus = txStatus === 'success' || txStatus === 'error'
    if (finalTxStatus && depositAmount !== undefined) {
      setDepositAmount(undefined)
    }
  }, [txStatus, depositAmount])

  useEffect(() => {
    if (error) {
      displayToast(t(error), ToastType.ERROR)
    }
  }, [error])

  const maxBalanceLimit =
    credentialPrefix === WalletPrefix.TWO ? MAX_EFFECTIVE_BALANCE : EFFECTIVE_BALANCE
  const isMaxedEffectiveBalance = effective > maxBalanceLimit || effectiveBalance >= maxBalanceLimit
  const isInvalidDepositInput = sanitizedDepositAmount < 1
  const maxEffectiveAmount = maxBalanceLimit + upOffsetAmount - balance - pendingDepositAmount
  const setDepositInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const amount = e.target.value
      setDepositAmount(
        amount ? (amount > maxEffectiveAmount ? maxEffectiveAmount : Number(amount)) : undefined,
      )
    },
    [maxEffectiveAmount],
  )

  const { isSufficient } = useHasSufficientBalance(
    depositAmount ? parseEther(depositAmount.toString()) : 0n,
  )

  const setMaxAmount = () => setDepositAmount(maxEffectiveAmount)

  const submitDeposit = async () => {
    if (!depositAmount) return

    try {
      await makeDeposit(pubKey, parseEther(depositAmount.toString()))
    } catch (e) {
      console.error(e)
    }
  }

  const beaconChaLink = isValidNetwork(chainId)
    ? getBeaconChaLink(chainId, `/validator/${index}#deposits`)
    : null

  const pendingDepositTableRender = useMemo(() => {
    return (
      <ValidatorInfoTable
        className='mt-10'
        title={t('validatorManagement.partialDeposit.pendingDeposits')}
        emptyText={t('validatorManagement.partialDeposit.noPendingDeposits')}
        headers={headers}
      >
        {filteredDeposits.map((deposit, index) => (
          <ValidatorPendingDepositRow key={index} headSlot={headSlot} deposit={deposit} />
        ))}
      </ValidatorInfoTable>
    )
  }, [t, headers, filteredDeposits, headSlot])

  return (
    <div className='w-full'>
      <div className='w-full h-48 relative p-4'>
        <div className='relative z-20 space-x-4 flex items-center'>
          <i onClick={viewDetails} className='bi-chevron-left dark:text-dark300 cursor-pointer' />
          <Typography type='text-subtitle1' fontWeight='font-light'>
            {t('validatorManagement.partialDeposit.title')}
          </Typography>
        </div>
        <div className='absolute overflow-hidden z-10 top-0 left-0 w-full h-full'>
          <GradientHeader speed={0.15} name='deposit-gradient-header' className='h-full' isReady />
        </div>
      </div>
      <div className='w-full flex flex-col overflow-auto'>
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
                {isMaxedEffectiveBalance ? (
                  <InfoBox
                    type={InfoBoxType.WARNING}
                    text={t('validatorManagement.partialDeposit.isMaxedEffectiveBalanceText')}
                  />
                ) : (
                  <InfoBox
                    type={InfoBoxType.NOTICE}
                    text={t('validatorManagement.partialDeposit.depositHelperText')}
                  />
                )}
                <div className='w-full relative space-y-1'>
                  <Input
                    isErrorBorder={depositAmount !== undefined && isInvalidDepositInput}
                    value={depositAmount || ''}
                    disabled={isLoading}
                    className='flex-1'
                    min={0}
                    inputStyle='basic_border'
                    type='number'
                    onChange={setDepositInput}
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
                <WalletActionGuard isSufficientBalance={isSufficient} guardActionClass='w-full'>
                  <Button
                    onClick={submitDeposit}
                    isLoading={isLoading}
                    isDisabled={isInvalidDepositInput || isMaxedEffectiveBalance || isLoading}
                    className='w-full'
                    type={ButtonFace.SECONDARY}
                  >
                    {t('validatorManagement.partialDeposit.addFunds')}
                  </Button>
                </WalletActionGuard>
              </div>
            )}
          </div>
          <div className='flex-1 order-1 lg:order-2 mt-4 lg:mt-0 space-y-4'>
            <BasicValidatorMetrics validatorEpochData={validatorEpochData} validator={validator} />
            <EffectiveBalanceDisplay
              isFullDisplay
              maxEffectiveBalance={maxEffectiveBalance}
              supplementAmount={sanitizedDepositAmount + pendingDepositAmount}
              className='p-4 border-style'
              validator={validator}
            />
          </div>
        </div>
        {beaconChaLink ? (
          <Link target='_blank' href={beaconChaLink}>
            {pendingDepositTableRender}
          </Link>
        ) : (
          pendingDepositTableRender
        )}
      </div>
    </div>
  )
}

export default ValidatorDeposit
