import { parseEther } from 'ethers'
import { FC, InputHTMLAttributes, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import displayToast from '../../../../../../utilities/displayToast'
import {
  EFFECTIVE_BALANCE,
  MAX_BALANCE_INPUT,
  MAX_EFFECTIVE_BALANCE,
} from '../../../../../constants/constants'
import { WalletPrefix } from '../../../../../constants/enums'
import useHasSufficientBalance from '../../../../../hooks/useHasSufficientBalance'
import useResolveTransactionOnce from '../../../../../hooks/useResolveTransactionOnce'
import useValidatorDeposit from '../../../../../hooks/useValidatorDeposit'
import { beaconNodeSpec } from '../../../../../recoil/atoms'
import { ToastType } from '../../../../../types'
import Button, { ButtonFace } from '../../../../Button/Button'
import Input from '../../../../Input/Input'
import TransactionStatus from '../../../../TransactionStatus/TransactionStatus'
import Typography from '../../../../Typography/Typography'
import WalletActionGuard from '../../../../WalletActionGuard/WalletActionGuard'

export interface SignAndDepositFundsProps
  extends Pick<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  mnemonic: string | null
  mnemonicIndex: number | null
  withdrawalAddress: string
  effectiveBalance: number
  balance: number
  credentialPrefix: WalletPrefix
}

const SignAndDepositFunds: FC<SignAndDepositFundsProps> = ({
  mnemonic,
  mnemonicIndex,
  withdrawalAddress,
  effectiveBalance,
  balance,
  onChange,
}) => {
  const { t } = useTranslation()
  const beaconSpec = useRecoilValue(beaconNodeSpec)
  const effectiveBalanceWei = parseEther(effectiveBalance.toString())
  const inputBalanceWei = parseEther(balance.toString())
  const projectedBalanceWei = effectiveBalanceWei + inputBalanceWei
  const withdrawalPrefix = withdrawalAddress?.slice(0, 4)
  const balanceLimitWei =
    Number(withdrawalPrefix) === WalletPrefix.TWO
      ? parseEther(MAX_EFFECTIVE_BALANCE.toString())
      : parseEther(EFFECTIVE_BALANCE.toString())
  const isExceedBalance = projectedBalanceWei > balanceLimitWei
  const isMinDepositAmount = inputBalanceWei >= parseEther('1')

  const formattedBalance = parseEther(balance.toFixed(14))

  const { isSufficient } = useHasSufficientBalance(formattedBalance)
  const validator = {
    index: mnemonicIndex,
    effectiveBalance: formattedBalance,
    withdrawalPrefix,
    withdrawalCredentials: `0x${withdrawalAddress.slice(-40)}`,
  } as any

  const { makeDeposit, txHash, isLoading, error } = useValidatorDeposit({
    validator,
    mnemonic: mnemonic as string,
    beaconSpec,
  })

  const { txStatus } = useResolveTransactionOnce(txHash)

  const isError = txStatus === 'error'

  useEffect(() => {
    if (error) {
      displayToast(t(error), ToastType.ERROR)
    }
  }, [error])

  const deposit = async () => {
    if (isExceedBalance || !isSufficient) return

    try {
      await makeDeposit()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      {txHash ? (
        <div className='w-full py-4'>
          <TransactionStatus
            title={t(`validatorManagement.txStatuses.${txStatus}.title`)}
            text={!isError ? t(`validatorManagement.txStatuses.${txStatus}.text`) : undefined}
            networkId={beaconSpec.DEPOSIT_NETWORK_ID}
            status={txStatus || 'pending'}
            txHash={txHash}
          >
            {isError && (
              <div className='space-y-2'>
                <Typography type='text-caption1'>
                  {t('validatorManagement.txStatuses.error.text')}
                </Typography>
                <div onClick={makeDeposit} className='cursor-pointer'>
                  <Typography type='text-caption1' className='underline'>
                    {t('validatorManagement.retryTransaction')}
                  </Typography>
                </div>
              </div>
            )}
          </TransactionStatus>
        </div>
      ) : (
        <div className='w-full space-y-4 py-4 px-2'>
          <Typography type='text-caption1'>
            {t('validatorManagement.partialDeposit.depositAmountHelperText')}
          </Typography>
          <Input
            inputStyle='basic_border'
            onChange={onChange}
            step={1}
            min={0}
            max={MAX_BALANCE_INPUT}
            type='number'
          />
          <WalletActionGuard guardActionClass='w-full' isSufficientBalance={isSufficient}>
            <Button
              className='w-full'
              onClick={deposit}
              isLoading={isLoading}
              type={ButtonFace.SECONDARY}
              isDisabled={!balance || !isMinDepositAmount || isExceedBalance}
            >
              {t('validatorManagement.makeDeposit')}
            </Button>
          </WalletActionGuard>
        </div>
      )}
    </>
  )
}

export default SignAndDepositFunds
