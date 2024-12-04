import { motion } from 'framer-motion'
import Carousel from 'nuka-carousel'
import { ChangeEvent, FC, useMemo, useState } from 'react'
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
import ProgressBar from '../../ProgressBar/ProgressBar'
import Typography from '../../Typography/Typography'
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
  const [step, setStep] = useState(0)
  const beaconSpec = useRecoilValue(beaconNodeSpec)

  const { DEPOSIT_NETWORK_ID, BASE_REWARD_FACTOR } = beaconSpec || {}

  const baseStepLocale = 'validatorManagement.createValidator.steps'
  const steps = [
    t(`${baseStepLocale}.setup`),
    t(`${baseStepLocale}.verification`),
    t(`${baseStepLocale}.indexing`),
    t(`${baseStepLocale}.credentials`),
    'Keystore Authentication',
    t(`${baseStepLocale}.deposit`),
  ]
  const [candidates, setValidatorCandidates] = useState<ValidatorCandidate[]>([])
  const [keyPhrase, setKeyPhrase] = useState('')
  const [sharedWithdrawalCredentials, setSharedCredentials] = useState('')
  const [sharedKeystorePassword, setSharedKeystorePassword] = useState('')
  const [isRisk, setIsRisk] = useState(false)

  const { active_ongoing } = validatorNetworkData
  const totalCandidates = candidates.length
  const totalSteps = steps.length

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

  const incrementStep = () => setStep((prevStep) => Math.min(prevStep + 1, totalSteps - 1))
  const decrementStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0))
  const setNewValidators = (vals: ValidatorCandidate[]) => setValidatorCandidates(vals)
  const setPhrase = (e: ChangeEvent<HTMLTextAreaElement>) => setKeyPhrase(e.target.value)
  const setCredentials = (credentials: string) => setSharedCredentials(credentials)
  const setKeystorePassword = (password: string) => setSharedKeystorePassword(password)

  const showRiskMessage = () => setIsRisk(true)
  const dismissRiskMessage = () => setIsRisk(false)
  const acceptRisks = () => {
    dismissRiskMessage()
    incrementStep()
  }
  const viewManagement = () => onChangeView(ValidatorManagementView.MAIN)

  return (
    <>
      <div className='flex-1'>
        <div className='w-full'>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full flex'>
            {steps.map((step, index) => (
              <div
                key={index}
                className='flex-1 h-11 bg-dark25 dark:bg-dark750 flex items-center justify-center border-r dark:border-r-dark600 last:border-r-0'
              >
                <div className='flex space-x-2 items-center'>
                  <div className='w-6 h-6 lg:w-3 lg:h-3 flex items-center justify-center border dark:border-dark300 text-dark900 rounded-full'>
                    <Typography type='text-caption' className='lg:text-xTiny'>
                      {index + 1}
                    </Typography>
                  </div>
                  <Typography className='hidden lg:block' type='text-caption1'>
                    {step}
                  </Typography>
                </div>
              </div>
            ))}
          </motion.div>
          <ProgressBar total={totalSteps} position={step + 1} />
        </div>
        <div className='w-full h-full relative createSlide'>
          <Carousel swiping={false} slideIndex={step} dragging={false} withoutControls>
            <CreateValidatorStep
              rewardEstimate={calculatedRewards}
              candidateCount={totalCandidates}
            >
              <ValidatorSetup
                onNextStep={incrementStep}
                onValidatorChange={setNewValidators}
                candidates={candidates}
              />
            </CreateValidatorStep>

            <CreateValidatorStep
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
              rewardEstimate={calculatedRewards}
              candidateCount={totalCandidates}
            >
              <WithdrawalCredentials
                onShowRisk={showRiskMessage}
                isActive={step === 3}
                candidates={candidates}
                onValidatorChange={setNewValidators}
                onBackStep={decrementStep}
                onNextStep={incrementStep}
                onUpdateSharedCredentials={setCredentials}
                sharedCredentials={sharedWithdrawalCredentials}
              />
            </CreateValidatorStep>

            <CreateValidatorStep
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
          </Carousel>
        </div>
      </div>
      <RiskModal isOpen={isRisk} onAccept={acceptRisks} onClose={dismissRiskMessage} />
    </>
  )
}

export default CreateValidatorView
