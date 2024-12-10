import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import addClassString from '../../../utilities/addClassString'
import displayToast from '../../../utilities/displayToast'
import useHasSufficientBalance from '../../hooks/useHasSufficientBalance'
import { KeyStoreData } from '../../hooks/useLodestarDepositData'
import useValidatorDeposit, { ValidatorDepositConfig } from '../../hooks/useValidatorDeposit'
import { DepositData, ToastType, TxHash, ValidatorCandidate } from '../../types'
import Button, { ButtonFace } from '../Button/Button'
import Spinner from '../Spinner/Spinner'
import ValidatorCandidateRow from '../ValidatorCandidateRow/ValidatorCandidateRow'
import WalletActionBtn from '../WalletActionBtn/WalletActionBtn'

export interface ValidatorDepositRowProps extends Omit<ValidatorDepositConfig, 'validator'> {
  candidate: ValidatorCandidate
  onDeposit: (txHash: TxHash, keyStore: KeyStoreData, pubKey: string, mnemonicIndex: number) => void
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
  const { MIN_ACTIVATION_BALANCE } = beaconSpec
  const { index } = candidate
  const { isLoading, txHash, error, pubKey, keyStore, makeDeposit } = useValidatorDeposit({
    validator: candidate,
    mnemonic,
    beaconSpec,
  })

  const { isSufficient } = useHasSufficientBalance(BigInt(MIN_ACTIVATION_BALANCE))

  useEffect(() => {
    if (txHash && pubKey && !!keyStore) {
      onDeposit(txHash, keyStore, pubKey, index as number)
    }
  }, [txHash, keyStore, pubKey, index])

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
      <div className='flex items-center justify-center px-4'>
        {!!data ? (
          data.status === 'pending' ? (
            <Spinner size='h-3 w-3' />
          ) : (
            <i className={statusIconClass} />
          )
        ) : (
          <WalletActionBtn isSufficientBalance={isSufficient}>
            <Button isLoading={isLoading} onClick={makeDeposit} type={ButtonFace.SECONDARY}>
              {t('validatorManagement.makeDeposit')}
            </Button>
          </WalletActionBtn>
        )}
      </div>
    </ValidatorCandidateRow>
  )
}

export default ValidatorDepositRow
