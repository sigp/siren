import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ValidatorInfo } from '../../../types/validator'
import HorizontalStepper from '../../HorizontalStepper/HorizontalStepper'
import SelectSourceStep from './Steps/SelectSourceStep/SelectSourceStep'
import SelectTargetStep from './Steps/SelectTargetStep/SelectTargetStep'
import SubmitConsolidationStep from './Steps/SubmitConsolidationStep/SubmitConsolidationStep'

export interface ConsolidateViewProps {
  validators: ValidatorInfo[]
  chainId: number
}

const ConsolidateView: FC<ConsolidateViewProps> = ({ validators, chainId }) => {
  const { t } = useTranslation()
  const [targetValidator, setTargetValidator] = useState<ValidatorInfo | undefined>(undefined)
  const [sourceValidators, setSourceValidators] = useState<ValidatorInfo[]>([])
  const eligibleValidators = useMemo(() => {
    return validators.filter(
      ({ status, withdrawalAddress }) =>
        status.includes('active') &&
        !status.includes('exit') &&
        withdrawalAddress &&
        (withdrawalAddress.startsWith('0x01') || withdrawalAddress.startsWith('0x02')),
    )
  }, [validators])
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
            targetValidator={targetValidator}
            onSelect={updateTargetValidator}
            validators={eligibleValidators}
          />
          {step > 0 && (
            <SelectSourceStep
              onNext={incrementStep}
              onBack={decrementStep}
              onSelectTargetValidators={updateSourceValidators}
              validators={eligibleValidators}
              targetValidator={targetValidator}
            />
          )}
          <SubmitConsolidationStep
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
