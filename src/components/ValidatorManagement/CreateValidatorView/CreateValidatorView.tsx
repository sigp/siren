import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { EFFECTIVE_BALANCE } from '../../../constants/constants'
import { beaconNodeSpec } from '../../../recoil/atoms'
import {
  ValidatorCandidate,
  ValidatorManagementView,
  ValidatorRewardEstimate,
} from '../../../types'
import { ValidatorCountResult } from '../../../types/validator'
import HorizontalStepper from '../../HorizontalStepper/HorizontalStepper'
import CreateValidatorStep from './CreateValidatorStep'
import RiskModal from './RiskModal'
import KeystoreAuthentication from './Steps/KeystoreAuthentication/KeystoreAuthentication'
import MnemonicIndex from './Steps/MnemonicIndex/MnemonicIndex'
import MnemonicPhrase from './Steps/MnemonicPhrase'
import SignDeposit from './Steps/SignDepositValidators/SignDeposit'
import ValidatorSetup from './Steps/ValidatorSetup/ValidatorSetup'
import WithdrawalCredentials from './Steps/WithdrawalCredentials'

export interface CreateValidatorViewProps {
  validatorNetworkData: ValidatorCountResult
  onChangeView: (view: ValidatorManagementView) => void
}

const CreateValidatorView: FC<CreateValidatorViewProps> = ({
  validatorNetworkData,
  onChangeView,
}) => {
  const { t } = useTranslation()
  const beaconSpec = useRecoilValue(beaconNodeSpec)

  const { DEPOSIT_NETWORK_ID, BASE_REWARD_FACTOR, MIN_ACTIVATION_BALANCE } = beaconSpec || {}

  const baseStepLocale = 'validatorManagement.createValidator.steps'
  const steps = useMemo(
    () => [
      t(`${baseStepLocale}.setup`),
      t(`${baseStepLocale}.verification`),
      t(`${baseStepLocale}.indexing`),
      t(`${baseStepLocale}.credentials`),
      'Keystore Authentication',
      t(`${baseStepLocale}.deposit`),
    ],
    [t],
  )

  const [candidates, setValidatorCandidates] = useState<ValidatorCandidate[]>([])
  const [keyPhrase, setKeyPhrase] = useState('')
  const [sharedWithdrawalCredentials, setSharedCredentials] = useState<string | undefined>()
  const [sharedKeystorePassword, setSharedKeystorePassword] = useState<string | undefined>(
    undefined,
  )
  const [isRisk, setIsRisk] = useState(false)
  const [hasAcceptedRisk, setHasAcceptRisk] = useState(false)

  const { active_ongoing } = validatorNetworkData
  const totalCandidates = candidates.length

  const requiredStake = candidates.reduce((prev, current) => prev + current.effectiveBalance, 0n)

  const calculatedRewards = useMemo<ValidatorRewardEstimate>(() => {
    const totalActiveBalance = active_ongoing * EFFECTIVE_BALANCE
    const annualIssuance = Number(BASE_REWARD_FACTOR || 0) * Math.sqrt(totalActiveBalance)

    const apr = (annualIssuance / totalActiveBalance) * 100
    const totalAnnualRewards = (annualIssuance / active_ongoing) * totalCandidates

    return {
      apr,
      totalAnnualRewards,
    }
  }, [active_ongoing, totalCandidates, BASE_REWARD_FACTOR])

  const setNewValidators = useCallback((vals: ValidatorCandidate[]) => {
    setValidatorCandidates(vals)
  }, [])

  const setPhrase = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setKeyPhrase(e.target.value)
  }, [])

  const updateSharedCredentials = useCallback((credentials?: string) => {
    setSharedCredentials(credentials)
  }, [])

  const setKeystorePassword = useCallback((password: string | undefined) => {
    setSharedKeystorePassword(password)
  }, [])

  const showRiskMessage = useCallback(() => {
    setIsRisk(true)
    setHasAcceptRisk(false)
  }, [])

  const dismissRiskMessage = useCallback(() => {
    setIsRisk(false)
  }, [])

  const viewManagement = useCallback(() => {
    onChangeView(ValidatorManagementView.MAIN)
  }, [onChangeView])

  const acceptRisk = useCallback(() => {
    setHasAcceptRisk(true)
    dismissRiskMessage()
  }, [dismissRiskMessage])

  return (
    <>
      <RiskModal isOpen={isRisk} onAccept={acceptRisk} onClose={dismissRiskMessage} />
      <HorizontalStepper steps={steps}>
        {({ incrementStep, decrementStep, step }) => (
          <>
            <CreateValidatorStep
              requiredStake={requiredStake}
              rewardEstimate={calculatedRewards}
              candidateCount={totalCandidates}
            >
              {MIN_ACTIVATION_BALANCE && (
                <ValidatorSetup
                  onNextStep={incrementStep}
                  onValidatorChange={setNewValidators}
                  minActivationBalance={MIN_ACTIVATION_BALANCE}
                  candidates={candidates}
                />
              )}
            </CreateValidatorStep>

            <CreateValidatorStep
              requiredStake={requiredStake}
              rewardEstimate={calculatedRewards}
              candidateCount={totalCandidates}
            >
              <MnemonicPhrase
                isActive={step === 1}
                onNextStep={incrementStep}
                value={keyPhrase}
                onChange={setPhrase}
                onBackStep={decrementStep}
              />
            </CreateValidatorStep>

            {DEPOSIT_NETWORK_ID && (
              <CreateValidatorStep
                requiredStake={requiredStake}
                rewardEstimate={calculatedRewards}
                candidateCount={totalCandidates}
              >
                <MnemonicIndex
                  depositNetworkId={DEPOSIT_NETWORK_ID}
                  isActive={step === 2}
                  onBackStep={decrementStep}
                  onValidatorChange={setNewValidators}
                  onNextStep={incrementStep}
                  keyPhrase={keyPhrase}
                  candidates={candidates}
                />
              </CreateValidatorStep>
            )}

            <CreateValidatorStep
              requiredStake={requiredStake}
              rewardEstimate={calculatedRewards}
              candidateCount={totalCandidates}
            >
              <WithdrawalCredentials
                onShowRisk={showRiskMessage}
                hasAcceptedRisk={hasAcceptedRisk}
                isActive={step === 3}
                candidates={candidates}
                onValidatorChange={setNewValidators}
                onBackStep={decrementStep}
                onNextStep={incrementStep}
                onUpdateSharedCredentials={updateSharedCredentials}
                sharedCredentials={sharedWithdrawalCredentials}
              />
            </CreateValidatorStep>

            <CreateValidatorStep
              requiredStake={requiredStake}
              rewardEstimate={calculatedRewards}
              candidateCount={totalCandidates}
            >
              <KeystoreAuthentication
                onUpdateCandidates={setNewValidators}
                sharedKeystorePassword={sharedKeystorePassword}
                setSharedKeystorePassword={setKeystorePassword}
                candidates={candidates}
                onBackStep={decrementStep}
                onNextStep={incrementStep}
              />
            </CreateValidatorStep>

            {Boolean(candidates.length) && beaconSpec && (
              <SignDeposit
                sharedKeystorePassword={sharedKeystorePassword}
                beaconSpec={beaconSpec}
                sharedWithdrawalCredentials={sharedWithdrawalCredentials}
                onComplete={viewManagement}
                rewardEstimate={calculatedRewards}
                mnemonic={keyPhrase}
                candidates={candidates}
              />
            )}
          </>
        )}
      </HorizontalStepper>
    </>
  )
}

export default CreateValidatorView
