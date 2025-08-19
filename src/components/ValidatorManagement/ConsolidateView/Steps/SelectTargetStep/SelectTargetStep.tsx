import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ValidatorLogo from '../../../../../assets/images/validators.svg'
import useAnimatedListControls from '../../../../../hooks/useAnimatedListControls'
import { useMaxHeight } from '../../../../../hooks/useMaxHeight'
import { ValidatorInfo } from '../../../../../types/validator'
import CustomValidatorInput from '../../../../CustomValidatorInput/CustomValidatorInput'
import NoEligibleValidatorsFound from '../../../../EmptyState/NoEligibleValidatorsFound'
import Toggle from '../../../../Toggle/Toggle'
import Typography from '../../../../Typography/Typography'
import StepOptions from '../../../CreateValidatorView/StepOptions'
import SelectTargetRow from './SelectTargetRow'

export interface SelectTargetStepProps {
  validators: ValidatorInfo[]
  targetValidator: ValidatorInfo | undefined
  onSelect: (validator: ValidatorInfo) => void
  onNext: () => void
  isActive: boolean
}

const SelectTargetStep: FC<SelectTargetStepProps> = ({
  validators,
  targetValidator,
  onSelect,
  onNext,
  isActive,
}) => {
  const { t } = useTranslation()
  const { controls } = useAnimatedListControls(isActive)
  const { parentRef, targetChildRef, maxHeight } = useMaxHeight()
  const [useCustomValidator, setUseCustomValidator] = useState(false)
  const [customValidator, setCustomValidator] = useState<ValidatorInfo | null>(null)
  const [previousListSelection, setPreviousListSelection] = useState<ValidatorInfo | null>(null)

  const handleCustomValidatorFound = (validator: ValidatorInfo) => {
    setCustomValidator(validator)
    onSelect(validator)
  }

  const handleCustomValidatorClear = () => {
    setCustomValidator(null)
    if (targetValidator && targetValidator === customValidator) {
      // Clear the target validator if it was the custom one
      // We need to pass undefined but the onSelect type expects ValidatorInfo
      // This might need adjustment in the parent component
    }
  }

  const handleToggleCustomValidator = (enabled: boolean) => {
    setUseCustomValidator(enabled)
    if (enabled) {
      // Store the current selection from list before switching to custom
      if (targetValidator && !customValidator) {
        setPreviousListSelection(targetValidator)
      }
    } else {
      // Switching back to list view
      setCustomValidator(null)
      handleCustomValidatorClear()
      // Restore previous list selection if it exists
      if (previousListSelection) {
        onSelect(previousListSelection)
      }
    }
  }

  const handleSelectFromList = (validator: ValidatorInfo) => {
    if (!useCustomValidator) {
      onSelect(validator)
      // Update the previous selection tracker when selecting from list
      setPreviousListSelection(validator)
    }
  }

  const renderedRows = useMemo(() => {
    return validators.length ? (
      validators.map((validator, index) => (
        <SelectTargetRow
          animIndex={index}
          animControls={controls}
          isActive={
            !useCustomValidator && !!targetValidator && targetValidator.pubKey === validator.pubKey
          }
          key={validator.pubKey}
          onSelect={handleSelectFromList}
          validator={validator}
        />
      ))
    ) : (
      <NoEligibleValidatorsFound />
    )
  }, [validators, targetValidator, handleSelectFromList, controls, useCustomValidator])

  return (
    <div className='w-full flex-1 flex flex-col items-center pt-6'>
      <div className='max-w-[620px] flex-1 flex flex-col space-y-6 w-full'>
        <div className='space-y-1'>
          <Typography type='text-subtitle2'>
            {t('validatorManagement.consolidateView.selectTarget.title')}
          </Typography>
          <Typography type='text-caption'>
            {t('validatorManagement.consolidateView.selectTarget.text')}
          </Typography>
        </div>

        <div className='flex items-center space-x-3 p-3 border-style rounded'>
          <Toggle
            id='custom-validator-toggle'
            value={useCustomValidator}
            onChange={handleToggleCustomValidator}
          />
          <div className='flex-1'>
            <Typography type='text-caption1'>
              {t('validatorManagement.consolidateView.customTarget.title')}
            </Typography>
            <Typography type='text-caption2' color='text-dark400'>
              {t('validatorManagement.consolidateView.customTarget.description')}
            </Typography>
          </div>
        </div>
        <div ref={parentRef} className='space-y-4 flex-1'>
          {useCustomValidator ? (
            <CustomValidatorInput
              onValidatorFound={handleCustomValidatorFound}
              onValidatorClear={handleCustomValidatorClear}
              className='border-style rounded p-4'
            />
          ) : (
            <div
              ref={targetChildRef}
              style={{ maxHeight: maxHeight }}
              className='w-full flex-1 flex flex-col border-style rounded'
            >
              <div className='w-full py-2 flex items-center space-x-2 px-4 border-b-style'>
                <div className='w-4 h-4'>
                  <ValidatorLogo className='text-black dark:text-dark500' />
                </div>
                <Typography>{t('validators')}</Typography>
              </div>
              <div className='h-full overflow-auto'>{renderedRows}</div>
            </div>
          )}
          <StepOptions onNextStep={onNext} isDisabledNext={!targetValidator} />
        </div>
      </div>
    </div>
  )
}

export default SelectTargetStep
