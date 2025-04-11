import clsx from 'clsx'
import { debounce } from 'lodash'
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import displayToast from '../../../../../utilities/displayToast'
import getMnemonicStats from '../../../../../utilities/getMnemonicStats'
import getWordLength from '../../../../../utilities/getWordLength'
import {
  EFFECTIVE_BALANCE,
  MAX_BALANCE_INPUT,
  MAX_EFFECTIVE_BALANCE,
} from '../../../../constants/constants'
import { ValidatorModalView, WalletPrefix } from '../../../../constants/enums'
import useChainSafeKeygen from '../../../../hooks/useChainSafeKeygen'
import { blsModuleAtom } from '../../../../recoil/atoms'
import { ToastType } from '../../../../types'
import { ValidatorBalanceInfo, ValidatorInfo } from '../../../../types/validator'
import BasicValidatorMetrics from '../../../BasicValidatorMetrics/BasicValidatorMetrics'
import EffectiveBalanceDisplay from '../../../EffectiveBalanceDisplay/EffectiveBalanceDisplay'
import GradientHeader from '../../../GradientHeader/GradientHeader'
import InfoBox, { InfoBoxType } from '../../../InfoBox/InfoBox'
import Typography from '../../../Typography/Typography'
import VerticalStepper from '../../../VerticalStepper/VerticalStepper'
import { ValidatorModalContext } from '../../ValidatorModal'
import SignAndDepositFunds from './steps/SignAndDepositFunds'
import ValidateIndex from './steps/ValidateIndex'
import ValidateMnemonic from './steps/ValidateMnemonic'

export interface ValidatorDepositProps {
  validator: ValidatorInfo
  validatorEpochData: ValidatorBalanceInfo
}

const ValidatorDeposit: FC<ValidatorDepositProps> = ({ validator, validatorEpochData }) => {
  const { t } = useTranslation()
  const blsModule = useRecoilValue(blsModuleAtom)
  const { pubKey, effectiveBalance, withdrawalAddress } = validator

  const { moveToView } = useContext(ValidatorModalContext)
  const viewDetails = () => moveToView(ValidatorModalView.DETAILS)
  const [step, setStep] = useState(0)
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [mnemonicIndex, setMnemonicIndex] = useState<number | null>(null)
  const [inputBalance, setInputBalance] = useState<number>(0)
  const [isValidMnemonic, setIsValidMnemonic] = useState(false)
  const [isValidated, setIsValidated] = useState(false)
  const { generateSigningPubKey, deriveEIP2334SubKey } = useChainSafeKeygen(blsModule)
  const credentialPrefix = Number(withdrawalAddress?.slice(0, 4))
  const validMnemonic = isValidMnemonic ? mnemonic : null

  const maxBalanceLimit =
    credentialPrefix === WalletPrefix.TWO ? MAX_EFFECTIVE_BALANCE : EFFECTIVE_BALANCE
  const isMaxEffectiveBalance = effectiveBalance >= maxBalanceLimit

  const setPhrase = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setMnemonic(e.target.value),
    [],
  )

  const setDepositAmount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value || 0)
    setInputBalance(amount > MAX_BALANCE_INPUT ? MAX_BALANCE_INPUT : amount)
  }, [])

  const validateMnemonic = useCallback(async (keyPhrase: string) => {
    try {
      const eip2334SubKey = deriveEIP2334SubKey(keyPhrase)
      generateSigningPubKey(eip2334SubKey, 0)
      setIsValidMnemonic(true)
      setStep(1)
    } catch (e) {
      console.error(e)
      displayToast(t('validatorManagement.invalidMnemonic'), ToastType.ERROR)
      setIsValidMnemonic(false)
    } finally {
      setIsValidated(true)
    }
  }, [])

  const wordCount = getWordLength(String(mnemonic))
  const { isValid } = getMnemonicStats(wordCount)

  const debouncedValidateKeyPhraseRef = useRef(
    debounce((mnemonic: string) => {
      void validateMnemonic(mnemonic)
    }, 1000),
  )

  useEffect(() => {
    setIsValidated(false)
    if (!mnemonic || !isValid) return

    debouncedValidateKeyPhraseRef.current(mnemonic)
  }, [mnemonic, isValid])

  useEffect(() => {
    if (!mnemonic || mnemonicIndex === null || !isValidMnemonic) return

    setStep(2)
  }, [mnemonic, mnemonicIndex, isValidMnemonic])

  const setValidIndex = useCallback((index: number) => setMnemonicIndex(index), [])

  const stepTitles = useMemo(
    () => [
      t('validatorManagement.partialDeposit.subTitles.enterMnemonic'),
      t('validatorManagement.partialDeposit.subTitles.mnemonicIndex'),
      t('validatorManagement.partialDeposit.subTitles.signAndDeposit'),
    ],
    [],
  )

  const stepperClasses = clsx('w-1/2', isMaxEffectiveBalance && 'opacity-40 pointer-events-none')

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
      <div className='w-full flex p-4 space-x-4'>
        <div className={stepperClasses}>
          <VerticalStepper step={step} titles={stepTitles}>
            <ValidateMnemonic
              disabled={isMaxEffectiveBalance}
              isValidated={isValidated}
              isValidKeyPhrase={isValidMnemonic}
              onChange={setPhrase}
              value={mnemonic || ''}
            />
            <ValidateIndex onVerifyIndex={setValidIndex} mnemonic={validMnemonic} pubKey={pubKey} />
            <SignAndDepositFunds
              balance={inputBalance}
              credentialPrefix={credentialPrefix}
              withdrawalAddress={withdrawalAddress as string}
              effectiveBalance={effectiveBalance}
              onChange={setDepositAmount}
              mnemonic={mnemonic}
              mnemonicIndex={mnemonicIndex}
            />
          </VerticalStepper>
        </div>
        <div className='flex-1 space-y-4'>
          <BasicValidatorMetrics validatorEpochData={validatorEpochData} validator={validator} />
          <EffectiveBalanceDisplay
            supplementAmount={inputBalance}
            className='p-4 border-style'
            validator={validator}
          />
          {isMaxEffectiveBalance ? (
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
        </div>
      </div>
    </div>
  )
}

export default ValidatorDeposit
