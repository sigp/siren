import { FC, useMemo, useState } from 'react'
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
  const activeValidators = useMemo(() => {
    return validators.filter(({ status }) => status.includes('active') && !status.includes('exit'))
  }, [validators])
  const steps = [
    t('validatorManagement.consolidateView.steps.selectTarget'),
    t('validatorManagement.consolidateView.steps.selectSources'),
    t('validatorManagement.consolidateView.steps.signAndSubmit'),
  ]

  const updateTargetValidator = (validator: ValidatorInfo) => setTargetValidator(validator)
  const updateSourceValidators = (validators: ValidatorInfo[]) => setSourceValidators(validators)

  return (
    <HorizontalStepper steps={steps}>
      {({ incrementStep, decrementStep }) => (
        <>
          <SelectTargetStep
            onNext={incrementStep}
            targetValidator={targetValidator}
            onSelect={updateTargetValidator}
            validators={activeValidators}
          />
          <SelectSourceStep
            onNext={incrementStep}
            onBack={decrementStep}
            onSelectTargetValidators={updateSourceValidators}
            validators={activeValidators}
            targetValidator={targetValidator}
          />
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
