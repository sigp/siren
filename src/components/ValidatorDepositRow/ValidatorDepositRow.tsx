import { formatEther } from 'ethers'
import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import displayToast from '../../../utilities/displayToast'
import useHasSufficientBalance from '../../hooks/useHasSufficientBalance'
import useValidatorDeposit, { ValidatorDepositConfig } from '../../hooks/useValidatorDeposit'
import { DepositData, ToastType, TxHash, ValidatorCandidate } from '../../types'
import Button, { ButtonFace } from '../Button/Button'
import PillText from '../PillText/PillText'
import Spinner from '../Spinner/Spinner'
import ValidatorCandidateRow from '../ValidatorCandidateRow/ValidatorCandidateRow'
import WalletActionGuard from '../WalletActionGuard/WalletActionGuard'

export interface ValidatorDepositRowProps extends Omit<ValidatorDepositConfig, 'validator'> {
  candidate: ValidatorCandidate
  onDeposit: (
    txHash: TxHash,
    keyStorePassword: string,
    pubKey: string,
    mnemonicIndex: number,
  ) => void
  data: DepositData | undefined
}

const ValidatorDepositRow: FC<ValidatorDepositRowProps> = ({
  candidate,
  mnemonic,
  beaconSpec,
  onDeposit,
  data,
}) => {
  const { t } = useTranslation()
  const { index, effectiveBalance, pubKey: candidatePubKey, keyStorePassword } = candidate
  const { isLoading, txHash, error, pubKey, makeDeposit } = useValidatorDeposit({
    validator: candidate,
    mnemonic,
    beaconSpec,
  })
  const { isSufficient } = useHasSufficientBalance(effectiveBalance)

  useEffect(() => {
    if (txHash && pubKey && !!keyStorePassword) {
      onDeposit(txHash, keyStorePassword, pubKey, index as number)
    }
  }, [txHash, keyStorePassword, pubKey, index])

  useEffect(() => {
    if (error) {
      displayToast(t(error), ToastType.ERROR)
    }
  }, [error])

  const statusIconClass = addClassString('', [
    data?.status === 'success' ? 'bi-check-lg text-success' : 'bi-x text-error',
  ])

  return (
    <ValidatorCandidateRow data={candidate} index={index as number}>
      <div className='flex flex-1 items-center justify-between px-4'>
        <PillText
          id={`${candidatePubKey}-amount-text`}
          toolTipText={t('validatorManagement.requiredEthHelper')}
          textPrefix={t('required')}
          displayText={`${formatEther(effectiveBalance)} ETH`}
        />
        {!!data ? (
          data.status === 'pending' ? (
            <Spinner size='h-3 w-3' />
          ) : (
            <i className={statusIconClass} />
          )
        ) : (
          <WalletActionGuard isSufficientBalance={isSufficient}>
            <Button isLoading={isLoading} onClick={makeDeposit} type={ButtonFace.SECONDARY}>
              {t('validatorManagement.makeDeposit')}
            </Button>
          </WalletActionGuard>
        )}
      </div>
    </ValidatorCandidateRow>
  )
}

export default ValidatorDepositRow
