import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_EFFECTIVE_BALANCE } from '../../../constants/constants'
import { ValidatorInfo } from '../../../types/validator'
import HorizontalStepper from '../../HorizontalStepper/HorizontalStepper'
import SelectSourceStep from './Steps/SelectSourceStep/SelectSourceStep'
import SelectTargetStep from './Steps/SelectTargetStep/SelectTargetStep'
import SubmitConsolidationStep from './Steps/SubmitConsolidationStep/SubmitConsolidationStep'

export interface ConsolidateViewProps {
  validators: ValidatorInfo[]
  currentEpoch: number
  minValidatorWithdrawalDelay: number
  chainId: number
}

const ConsolidateView: FC<ConsolidateViewProps> = ({
  validators,
  chainId,
  currentEpoch,
  minValidatorWithdrawalDelay,
}) => {
  const { t } = useTranslation()
  const [targetValidator, setTargetValidator] = useState<ValidatorInfo | undefined>(undefined)
  const [sourceValidators, setSourceValidators] = useState<ValidatorInfo[]>([])
  const eligibleValidators = useMemo<ValidatorInfo[]>(
    () =>
      validators.filter(
        ({ status, withdrawalAddress }) =>
          status.includes('active') &&
          !status.includes('exit') &&
          withdrawalAddress &&
          (withdrawalAddress.startsWith('0x01') || withdrawalAddress.startsWith('0x02')),
      ),
    [validators],
  )

  const eligibleTargetValidators = useMemo(
    () =>
      eligibleValidators.filter(({ effectiveBalance }) => effectiveBalance < MAX_EFFECTIVE_BALANCE),
    [eligibleValidators],
  )

  const eligibleSourceValidators = useMemo(
    () =>
      eligibleValidators.filter(
        ({ activationEpoch }) => currentEpoch - activationEpoch > minValidatorWithdrawalDelay,
      ),
    [eligibleValidators],
  )

  const steps = [
    t('validatorManagement.consolidateView.steps.selectTarget'),
    t('validatorManagement.consolidateView.steps.selectSources'),
    t('validatorManagement.consolidateView.steps.signAndSubmit'),
  ]

  const updateTargetValidator = useCallback(
    (validator: ValidatorInfo) => setTargetValidator(validator),
    [],
  )
  const updateSourceValidators = useCallback(
    (validators: ValidatorInfo[]) => setSourceValidators(validators),
    [],
  )

  return (
    <HorizontalStepper steps={steps}>
      {({ incrementStep, decrementStep, step }) => (
        <>
          <SelectTargetStep
            onNext={incrementStep}
            isActive={step === 0}
            targetValidator={targetValidator}
            onSelect={updateTargetValidator}
            validators={eligibleTargetValidators}
          />
          {step > 0 && targetValidator && (
            <SelectSourceStep
              isActive={step === 1}
              onNext={incrementStep}
              onBack={decrementStep}
              onSelectTargetValidators={updateSourceValidators}
              validators={eligibleSourceValidators}
              targetValidator={targetValidator}
            />
          )}
          <SubmitConsolidationStep
            isActive={step === 2}
            chainId={chainId}
            targetValidator={targetValidator}
            sourceValidators={sourceValidators}
          />
        </>
      )}
    </HorizontalStepper>
  )
}

export default ConsolidateView
