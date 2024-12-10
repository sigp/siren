import axios from 'axios'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import displayToast from '../../../../../../../utilities/displayToast'
import formatEthAddress from '../../../../../../../utilities/formatEthAddress'
import { KeyStoreData } from '../../../../../../hooks/useLodestarDepositData'
import useResolveTransactionOnce from '../../../../../../hooks/useResolveTransactionOnce'
import useValidatorDeposit from '../../../../../../hooks/useValidatorDeposit'
import { ToastType, ValidatorCandidate } from '../../../../../../types'
import { BeaconNodeSpecResults } from '../../../../../../types/beacon'
import InvestRewards, { InvestRewardsProps } from '../../../../../InvestRewards/InvestRewards'
import Typography from '../../../../../Typography/Typography'
import VerticalStepper from '../../../../../VerticalStepper/VerticalStepper'
import AcceptRisks from '../AcceptRisks'
import ValidatorSuccessScreen from '../ValidatorSuccessScreen'
import DepositStep from './DepositSteps/DepositStep'
import ImportValidatorStep from './DepositSteps/ImportValidatorStep'
import ValidateTransactionStep from './DepositSteps/ValidateTransactionStep'

export interface SingleDepositProps extends Pick<InvestRewardsProps, 'rewardEstimate'> {
  candidate: ValidatorCandidate
  mnemonic: string
  onComplete: () => void
  beaconSpec: BeaconNodeSpecResults
}

const SingleDeposit: FC<SingleDepositProps> = ({
  candidate,
  mnemonic,
  onComplete,
  beaconSpec,
  ...props
}) => {
  const { t } = useTranslation()
  const { name, withdrawalCredentials, index } = candidate
  const { DEPOSIT_NETWORK_ID, MIN_ACTIVATION_BALANCE } = beaconSpec

  const [step, setStep] = useState(0)
  const incrementStep = () => setStep((prev) => prev + 1)
  const [isImportError, setIsImportError] = useState<boolean>(false)
  const [isSuccessScreen, setIsSuccessScreen] = useState(false)
  const [isAcknowledgeRisk, setIsAcknowledge] = useState(false)

  const stepTitles = [
    t('validatorManagement.signAndDeposit.stepTitles.makeDeposit'),
    t('validatorManagement.signAndDeposit.stepTitles.verifyTransaction'),
    t('validatorManagement.signAndDeposit.stepTitles.importValidator'),
  ]

  const { isLoading, error, keyStore, txHash, pubKey, makeDeposit } = useValidatorDeposit({
    validator: candidate,
    mnemonic,
    beaconSpec,
  })
  const { txStatus } = useResolveTransactionOnce(txHash)

  useEffect(() => {
    if (error) {
      displayToast(t(error), ToastType.ERROR)
    }
  }, [error])

  useEffect(() => {
    if (txHash) {
      incrementStep()
    }
  }, [txHash])

  useEffect(() => {
    if (txStatus === 'success' && keyStore) {
      ;(async () => {
        incrementStep()
        await importValidator(keyStore)
      })()
    }
  }, [txStatus, keyStore])

  const acknowledgeRisk = () => setIsAcknowledge(true)

  const importValidator = async (keyStore: KeyStoreData) => {
    try {
      const response = await axios.post('/api/validator-import', { data: keyStore })

      if (response.status) {
        setIsSuccessScreen(true)
      }
    } catch (e) {
      console.error(e)
      setIsImportError(true)
      displayToast(t('error.unexpectedValidatorImportError'), ToastType.ERROR)
    }
  }

  const retryTransaction = () => setStep(0)

  return (
    <div className='relative w-full h-full'>
      <div className='flex pt-8 w-full h-full'>
        <div className='flex-1 space-y-8'>
          <div>
            <Typography type='text-caption1'>
              {t('validatorManagement.signAndDeposit.title')} --
            </Typography>
            <Typography type='text-subtitle2' fontWeight='font-light'>
              {t('validatorManagement.signAndDeposit.subTitle')}
            </Typography>
          </div>
          <div className='w-[80%] pt-6 flex'>
            {isAcknowledgeRisk && (
              <div className='flex-1 space-y-8'>
                <div className='w-24 h-24 bg-gradient-to-r from-primary to-tertiary rounded-full' />
                <div>
                  <Typography type='text-subtitle2'>
                    {name || t('validatorManagement.customValidatorName')}
                  </Typography>
                  {withdrawalCredentials && (
                    <Typography color='text-dark400' type='text-subtitle3'>
                      {formatEthAddress(withdrawalCredentials)}
                    </Typography>
                  )}
                  <Typography color='text-dark400' type='text-subtitle3'>
                    {index}
                  </Typography>
                </div>
              </div>
            )}
            {isAcknowledgeRisk ? (
              <>
                {isSuccessScreen ? (
                  <ValidatorSuccessScreen
                    validatorPubKey={pubKey}
                    networkId={DEPOSIT_NETWORK_ID}
                    onClick={onComplete}
                  />
                ) : (
                  <div className='w-[500px] shadow'>
                    <VerticalStepper step={step} titles={stepTitles}>
                      <DepositStep
                        depositAmount={MIN_ACTIVATION_BALANCE}
                        isLoading={isLoading}
                        onDeposit={makeDeposit}
                      />
                      <ValidateTransactionStep
                        txHash={txHash}
                        txStatus={txStatus}
                        onRetry={retryTransaction}
                        networkId={DEPOSIT_NETWORK_ID}
                      />
                      <ImportValidatorStep
                        txHash={txHash}
                        networkId={DEPOSIT_NETWORK_ID}
                        pubKey={pubKey}
                        isImportError={isImportError}
                      />
                    </VerticalStepper>
                  </div>
                )}
              </>
            ) : (
              <AcceptRisks onAccept={acknowledgeRisk} beaconSpec={beaconSpec} />
            )}
          </div>
        </div>
        <InvestRewards candidateCount={1} {...props} />
      </div>
    </div>
  )
}

export default SingleDeposit
